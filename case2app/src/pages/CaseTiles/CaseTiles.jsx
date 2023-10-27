
import React, { useState } from "react";
import { Link } from 'react-router-dom';
import yaml from 'js-yaml';
import ReactJsonView from 'react-json-view';

import useGitHubApi from './../../hooks/useGitHubApi';

function CaseTiles() {

  const [refreshTimestamp, setRefreshTimestamp] = useState(new Date());

  const ghData = useGitHubApi('GET /repos/{owner}/{repo}/contents/repo/case/index.yaml',
    { owner: 'IBM', repo: 'cloud-pak' },
    {
      useCache: true,
      cacheKey: 'case2app:github.com/repos/IBM/cloud-pak/contents/repo/case/index.yaml',
      massage: (d) => {
        const decoded = atob(d.content);
        // console.log(decoded);
        const j = yaml.load(decoded);

        return Object.keys(j.entries).map(x => {
          const item = j.entries[x];
          return {
            id: x,
            name: x,
            ...item
          }
        })
      }
    },
    refreshTimestamp
  )

  console.log('CaseTiles', {ghData})
  return (
    <div className="catalog-container">
      <div className="category-section">
        {ghData?.status === 'fetched' ?

            ghData.payload?.data.map(x => {

            return (
              // <div class="pal--catalog-tile__content-wrapper"><div class="pal--catalog-tile__header-container"><div class="pal--catalog-tile__icon-container pal--catalog-tile__icon-with-label"><img src="https://raw.githubusercontent.com/terraform-ibm-modules/terraform-ibm-landing-zone/main/.docs/images/deploy-arch-slz-ocp-lt.svg" data-type="content" class="tile-image" alt="Red Hat OpenShift Container Platform on VPC landing zone"><div class="bx--tag header-tag bx--tag--md bx--tag--blue" id="tag-105"><span><span class="pal--catalog-tile__fs-12-fw-400 header-tag__text">Deployable architecture</span><svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="16" height="16" viewBox="0 0 32 32" aria-hidden="true"><path d="M24 21c-.5 0-1-.2-1.4-.6l-3-3C19.2 17 19 16.5 19 16s.2-1 .6-1.4l3-3C23 11.2 23.5 11 24 11c.5 0 1 .2 1.4.6l3 3C28.8 15 29 15.5 29 16c0 .5-.2 1-.6 1.4l-3 3C25 20.8 24.5 21 24 21zM24 13l-3 3 3 3 3-3L24 13zM16 13c-.5 0-1-.2-1.4-.6l-3-3C11.2 9 11 8.5 11 8s.2-1 .6-1.4l3-3C15 3.2 15.5 3 16 3c.5 0 1 .2 1.4.6l3 3C20.8 7 21 7.5 21 8c0 .5-.2 1-.6 1.4l-3 3C17 12.8 16.5 13 16 13zM16 5l-3 3 3 3 3-3L16 5zM16 29c-.5 0-1-.2-1.4-.6l-3-3C11.2 25 11 24.5 11 24s.2-1 .6-1.4l3-3C15 19.2 15.5 19 16 19c.5 0 1 .2 1.4.6l3 3C20.8 23 21 23.5 21 24c0 .5-.2 1-.6 1.4l-3 3C17 28.8 16.5 29 16 29zM16 21l-3 3 3 3 3-3L16 21zM8 21c-.5 0-1-.2-1.4-.6l-3-3C3.2 17 3 16.5 3 16s.2-1 .6-1.4l3-3C7 11.2 7.5 11 8 11c.5 0 1 .2 1.4.6l3 3C12.8 15 13 15.5 13 16c0 .5-.2 1-.6 1.4l-3 3C9 20.8 8.5 21 8 21zM8 13l-3 3 3 3 3-3L8 13z"></path></svg></span></div></div><div class="pal--catalog-tile__header pal--catalog-tile__icon-with-label"><div><p class="pal--catalog-tile__header-name">Red Hat OpenShift Container Platform on VPC landing zone</p><ul class="pal--catalog-tile__tag-container"><li class="pal--catalog-tile__tag">By IBM</li></ul></div></div></div><div class="pal--catalog-tile__desc-container"><div class="pal--catalog-tile__desc"><div class="pal--catalog-tile__desc-ellipsis"><p class="pal--catalog-tile__desc">Creates Red Hat OpenShift workload clusters on a secure VPC network</p></div></div></div></div>
              <a class="pal--catalog-tile" href={`case/${x.name}`}>
                <div className="pal--catalog-tile">
                <div className="pal--catalog-tile__header-container">
                {x.name}
                  </div>
                  <div className="pal--catalog-tile__desc-container">
                    {x.latestVersion}
                    </div>
                </div>
              </a>
            )
          })
          : null
        }
      </div>
    </div>
  )
}

export default CaseTiles;