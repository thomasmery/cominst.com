import React from "react";
import PropTypes from "prop-types";

const Page = props => {
  const {
    title,
    subtitle,
    content,
    contentParts,
    contentExpanded,
    secondaryImageObject,
    contentToggleHandler,
    noHeader,
  } = props;

  const secondaryImageUrl = secondaryImageObject
    ? secondaryImageObject.sizes.medium
    : "";

  return (
    <div>
      {secondaryImageUrl && (
        <img
          src={secondaryImageUrl}
          alt={title}
          className="alignright secondary-image"
        />
      )}
      {!noHeader && (
        <div className="header">
          <h3 className="title" dangerouslySetInnerHTML={{ __html: title }} />
          {subtitle && (
            <h4
              className="subtitle"
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />
          )}
        </div>
      )}
      <div className="content" dangerouslySetInnerHTML={{ __html: content }} />
      <div className="actions">
        {contentParts.length > 1 ? (
          <a onClick={contentToggleHandler}>
            {
              <span className={!contentExpanded && "collapsed"}>
                <svg
                  className="expand-button"
                  width="29px"
                  height="29px"
                  viewBox="0 0 29 29"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs />
                  <g
                    id="expand-button-container"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                    strokeLinecap="square"
                  >
                    <g
                      transform="translate(1.000000, 1.000000)"
                      stroke="#018EC0"
                      strokeWidth="2"
                    >
                      <path d="M0,13 L27,13" />
                      <path d="M14,27 L14,0" />
                    </g>
                  </g>
                </svg>
              </span>
            }
          </a>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

Page.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  content: PropTypes.string,
  contentParts: PropTypes.array,
  secondaryImageObject: PropTypes.object,
  contentExpanded: PropTypes.bool,
  contentToggleHandler: PropTypes.func,
  noHeader: PropTypes.bool,
};

export default Page;
