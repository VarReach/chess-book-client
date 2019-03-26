import React from 'react';

export default function UserDropDow(props) {
  return (
    <div className="dropdown app__header-user-dropdown">
      {...props.children}
    </div>
  )
}
