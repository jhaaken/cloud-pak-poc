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
	const cache = useRef({});
  const useCache = useRef(options?.useCache || false);
  const ignoreNotFoundError = useRef(options?.ignoreError || false);  // use to handle a 404 (not-found) and just return an empty payload
  const [refresh, setRefresh] = useState(timestampRefresh || '');
  const massageRef = useRef(options?.massage || '');
  const octokitOptionsRef = useRef(octokitOpts || '');

	const initialState = {
		status: 'idle',
		error: null,
		data: [],
	};

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
    // console.log('useGitHubApi: refresh', {refresh, timestampRefresh})
    if (refresh !== timestampRefresh) {
      setRefresh(timestampRefresh);
    }
  }, [refresh, timestampRefresh])

	useEffect(() => {

		let cancelRequest = false;
		if (!endpoint && !octokitOptionsRef.current) return;

		const fetchData = () => {
      // console.log('useGitHubApi: fetchData', {endpoint, options})

      dispatch({ type: 'FETCHING' });
      console.log(`[useGitHubApi] fetching ${endpoint}`);
      if (useCache.current && cache.current[endpoint]) {
        const data = cache.current[endpoint];
        console.log(`[useGitHubApi] fetching from cache ${endpoint}`, data);
				dispatch({ type: 'FETCHED', payload: data });
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

            if(useCache.current) cache.current[endpoint] = data;
            if (cancelRequest) return;
            console.log(`[useGitHubApi] fetching from github.com ${endpoint}`, data);

            if (massageRef.current && typeof massageRef.current === 'function') {
              const m =  massageRef.current(data);
              console.log(`[useGitHubApi] massaged from github.com ${endpoint}`, m);
              return dispatch({type: 'FETCHED', payload: m})
            }

           return dispatch({ type: 'FETCHED', payload: data });

          })
          .catch((error) => {
            if (ignoreNotFoundError && error?.response?.status === 404) return dispatch({ type: 'FETCHED', payload: '' });
            if (cancelRequest) return;
            console.error(`[useGitHubApi] error ${error.message}`, error);
            dispatch({ type: 'FETCH_ERROR', payload: error.message });
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