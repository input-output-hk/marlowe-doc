import React from 'react';
import Link from '@docusaurus/Link';
import ArrowRight from '@site/static/icons/arrow_right.svg';

function TutorialSections() {
  return(
    <div className="container">
      <div className="row">
        <div className="col col--6">
          <div className="card-container">
            <div className="card">
              <div className="card__header">
                <h3>Concepts</h3>
              </div>
              <div className="card__body">
                <p>
                  A primer to working with Marlowe. This series will teach core ideas behind working with smart contracts.
                </p>
              </div>
              <div className="card__footer">
                <Link to="/tutorials/concepts/overview">
                  Start <ArrowRight className="arrow" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="col col--6">
          <div className="card-container">
            <div className="card">
              <div className="card__header">
                <h3>Guides</h3>
              </div>
              <div className="card__body">
                <p>
                  More experienced users of Marlowe can learn from real-word usage of smart contracts with guided steps.
                </p>
              </div>
              <div className="card__footer">
                <Link to="/tutorials/guides/overview">
                  Start <ArrowRight className="arrow" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className="row">
        <div className="col col--6">
          <div className="card-container">
            <div className="card">
              <div className="card__header">
                <h3>Playbooks</h3>
              </div>
              <div className="card__body">
                <p>
                  Step-by-step instructions for accomplishing a specific task. Use this section as a reference for your workflows.
                </p>
              </div>
              <div className="card__footer">
                <Link to="/tutorials/playbooks/overview">
                  Start <ArrowRight className="arrow" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="col col--6">
          <div className="card-container">
            <div className="card">
              <div className="card__header">
                <h3>Videos</h3>
              </div>
              <div className="card__body">
                <p>
                  Videos provide a deep dive into a single topic or a well rounded introduction with emphasis on key ideas.
                </p>
              </div>
              <div className="card__footer">
                <Link to="/tutorials/concepts/overview">
                  Start <ArrowRight className="arrow" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TutorialSections;