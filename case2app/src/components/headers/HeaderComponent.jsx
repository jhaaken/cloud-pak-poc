import React, { useState } from "react";

import {
  Header,
  HeaderContainer,
  HeaderName,
  SkipToContent,
  HeaderGlobalBar,
  HeaderGlobalAction,
  HeaderPanel,
  Switcher,
  SwitcherItem,
  Button,
} from "@carbon/react";
import { Information } from "@carbon/react/icons";
import { Link } from "react-router-dom";

export default function HeaderComponent() {
  const [show, setShow] = useState(false);

  return (
    <HeaderContainer
      render={() => (
        <Header aria-label="PIKE">
          <SkipToContent />
          <HeaderName prefix="IBM">CASE to App</HeaderName>
          <HeaderGlobalBar>
            <HeaderGlobalBar>
              <HeaderGlobalAction
                onClick={() => (show ? setShow(false) : setShow(true))}
                aria-label="info"
              >
                <Information />
              </HeaderGlobalAction>
            </HeaderGlobalBar>
          </HeaderGlobalBar>
          <HeaderPanel expanded={show} aria-label="Info Section">
            <Switcher aria-label="info">
              <SwitcherItem aria-label="info">
                <h5>IBM CASE to App</h5>
                <p>Provides a simple way to view, search, filter & sort published IBM CASE version to app version, along with easy viewing of other metadata about the CASE</p>
                <br /><br />
                <p>source of the data is the CASE repository @ <Link to="https://github.com/IBM/cloud-pak">github.com/IBM/cloud-pak</Link></p>
                <div style={{marginTop: '2em'}}>
                  <Button onClick={() => {
                    for (const key of Object.keys(sessionStorage)) {
                      if (key.startsWith('case2app')) {
                        sessionStorage.removeItem(key);
                      }
                    }
                    alert('session cache for `case2app` cleared')
                  }}>Clear Cache</Button>
                  <div>data is cached in the browser's sessionStorage</div>
                </div>
              </SwitcherItem>
            </Switcher>
          </HeaderPanel>
        </Header>
      )}
    />
  );
}
