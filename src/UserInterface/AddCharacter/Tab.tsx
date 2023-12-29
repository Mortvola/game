import React from 'react';

type PropsType = {
  title: string,
  tabKey: string,
  selected: string,
  onSelect: (tabKey: string) => void,
}

const Tab: React.FC<PropsType> = ({
  title,
  tabKey,
  onSelect,
}) => {
  const handleClick = () => {
    onSelect(tabKey);
  }

  return (
    <div onClick={handleClick} >{title}</div>
  )
}

export default Tab;
