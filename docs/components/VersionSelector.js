import { orderBy } from 'lodash';

import styled, { keyframes, css } from 'react-emotion';

import * as React from 'react';
import * as Constants from '~/common/constants';
import { VERSIONS, LATEST_VERSION } from '~/common/versions';

import ChevronDownIcon from '~/components/icons/ChevronDown';

const STYLES_SELECT = css`
  display: inline-flex;
  position: relative;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0 0 4px 0;
`;

const STYLES_SELECT_TEXT = css`
  font-family: ${Constants.fontFamilies.mono};
  font-size: 10px;
  background: ${Constants.colors.black};
  color: ${Constants.colors.white};
  border-radius: 4px;
  padding: 4px 8px 4px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.07);
`;

const STYLES_SELECT_ELEMENT = css`
  position: absolute;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  width: 100%;
  border-radius: 0px;
  background: blue;
`;

const orderVersions = versions => {
  versions = [...versions];

  if (versions.indexOf('unversioned') >= 0) {
    versions.splice(versions.indexOf('unversioned'), 1);
  }

  if (versions.indexOf('latest') >= 0) {
    versions.splice(versions.indexOf('latest'), 1);
  }

  versions = orderBy(
    versions,
    v => {
      let match = v.match(/v([0-9]+)\./);
      return parseInt(match[1], 10);
    },
    ['asc']
  );

  versions.push('latest');

  if (
    (typeof window === 'object' && window._NODE_ENV === 'development') ||
    (process.env.NODE_ENV && process.env.NODE_ENV === 'development')
  ) {
    versions.push('unversioned');
  }

  return versions;
};

export default class VersionSelector extends React.Component {
  render() {
    return (
      <div className={STYLES_SELECT} style={this.props.style}>
        <label className={STYLES_SELECT_TEXT} htmlFor="version-menu">
          {this.props.activeVersion} <ChevronDownIcon style={{ marginLeft: 8 }} />
        </label>
        <select
          className={STYLES_SELECT_ELEMENT}
          id="version-menu"
          value={this.props.activeVersion}
          onChange={e => this.props.onSetVersion(e.target.value)}>
          {orderVersions(VERSIONS)
            .map(version => {
              return (
                <option key={version} value={version}>
                  {version === 'latest' ? 'latest (' + LATEST_VERSION + ')' : version}
                </option>
              );
            })
            .reverse()}
        </select>
      </div>
    );
  }
}
