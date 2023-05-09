import React from 'react';

interface Props extends React.HTMLAttributes<HTMLElement> {
  header?: string;
  href?: string;
}

const Card: React.FC<Props> = (props) => {
  const hasLink = typeof props.href === null;

  return (
    <div className="card-container">
      <div className="card">
        <div className="card__header">
          <h3>{props.header}</h3>
        </div>
        <div className="card__body">
          <p>{props.children}</p>
        </div>
        {hasLink ? (<button className="button button--link" href={props.href}></button>) : null}
      </div>
    </div>  
  );
};

export default Card;
