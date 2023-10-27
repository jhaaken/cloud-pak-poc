import { useEffect, useRef, useReducer, useState } from 'react';
import { Octokit } from '@octokit/core';

const octokitClient = new Octokit({});

/**
 *
 * @param {*} endpoint example octokit format - "GET /repos/{owner}/{repo}/contents/repo/case/index.yaml"
 * @param {*} options useCache: boolean, useToasterOnError: boolean, ignoreNotFoundError: boolean
 * @returns
 */
export const useGitHubApi = (endpoint, octokitOpts, options, timestampRefresh) => {
  console.log('useGitHubApi', {endpoint, options, timestampRefresh})
  const useCache = useRef(options?.useCache || false);
  const cacheKeyRef = useRef(options?.cacheKey || endpoint);
  const ignoreNotFoundError = useRef(options?.ignoreError || false);  // use to handle a 404 (not-found) and just return an empty payload
  const [refresh, setRefresh] = useState(timestampRefresh || '');
  const massageRef = useRef(options?.massage || '');
  const octokitOptionsRef = useRef(octokitOpts || '');

	const initialState = {
		status: 'idle',
		error: null,
		data: [],
	};

  // expects json/javascript object as it stringifies/encodes and decodes/parses when getting data back out
  // saved as: key = {timestamp: '', b64data: ''}
  // btoa - encode, atob - decodes
  const setCache = (key, jsonData) => {
    const b64data = btoa(JSON.stringify(jsonData));
    const d = {fetchTimestamp: new Date().toISOString(), fetchMode: 'cache', b64data: b64data}
    sessionStorage.setItem(key, JSON.stringify(d)); // base64 encrypt & store
    console.log(`[useGitHubAPI] data cached to ${key}`)
  }

  const getCache = (key) => {
    try {
      const d = JSON.parse(sessionStorage.getItem(key));
      d.data = JSON.parse(atob(d.b64data));
      return d;
    } catch (error) {
      console.error(`[useGitHubApi] error retrieving, decoding or parsing cache key ${key} from sessionStorage`)
      return '';
    }
  }

	const [state, dispatch] = useReducer((state, action) => {
		switch (action.type) {
			case 'FETCHING':
				return { ...initialState, status: 'fetching' };
			case 'FETCHED':
				return { ...initialState, status: 'fetched', payload: action.payload };
			case 'FETCH_ERROR':
				return { ...initialState, status: 'error', error: action.payload };
			default:
				return state;
		}
	}, initialState);

  useEffect(() => {
    console.log('useGitHubApi: refresh', {refresh, timestampRefresh})
    if (refresh !== timestampRefresh) {
      setRefresh(timestampRefresh);
      if(useCache.current) sessionStorage.removeItem(cacheKeyRef.current) // remove item to force cache
    }
  }, [refresh, timestampRefresh])

	useEffect(() => {

		let cancelRequest = false;
		if (!endpoint && !octokitOptionsRef.current) return;

		const fetchData = () => {
      // console.log('useGitHubApi: fetchData', {endpoint, options})

      dispatch({ type: 'FETCHING' });
      console.log(`[useGitHubApi] fetching ${endpoint}`);
      // TODO: add some type of cache timeout
      if (useCache.current && sessionStorage.hasOwnProperty(cacheKeyRef.current)) {
        const cache = getCache(cacheKeyRef.current);
        console.log(`[useGitHubApi] fetched endpoint ${endpoint} from cache with key ${cacheKeyRef.current}`, cache);
				dispatch({ type: 'FETCHED', payload: cache });
      } else {
        // octokitClient.request('GET /repos/{owner}/{repo}/contents/repo/case/index.yaml', {
        //   owner: 'IBM',
        //   repo: 'cloud-pak',
        // })
        console.log('fetchData', {ep: endpoint, octokitOptionsRef})

        octokitClient.request(endpoint, octokitOptionsRef.current)
          .then((response) => {
            // const data = options?.returnResponse ? response.data : response.data.data;
            const data = response.data;
            if (cancelRequest) return;
            console.log(`[useGitHubApi] fetched from github.com ${endpoint}`, data);

            if (massageRef.current && typeof massageRef.current === 'function') {
              const m =  massageRef.current(data);
              console.log(`[useGitHubApi] massaged from github.com ${endpoint}`, m);
              if(useCache.current) setCache(cacheKeyRef.current, m); // base64 encrypt & store

              return dispatch({type: 'FETCHED', payload: {fetchTimestamp: new Date().toISOString(), fetchMode: 'live', data: m}})  // cache returns metadata with data
            } else {
              if(useCache.current) setCache(cacheKeyRef.current, data); // base64 encrypt & store
            }

           return dispatch({ type: 'FETCHED', payload: {fetchTimestamp: new Date().toISOString(), fetchMode: 'live', data: data} });

          })
          .catch((error) => {
            if (ignoreNotFoundError && error?.response?.status === 404) return dispatch({ type: 'FETCHED', payload: {data: ''} });
            if (cancelRequest) return;
            console.error(`[useGitHubApi] error ${error.message}`, error);
            dispatch({ type: 'FETCH_ERROR', payload: {fetchTimestamp: new Date().toISOString(), fetchMode: 'error', data: error.message} });
          });
      }

    }

    fetchData();

    return function cleanup() {
			cancelRequest = true;
		};
	}, [endpoint, refresh]);

	return state;
};


export default useGitHubApi;