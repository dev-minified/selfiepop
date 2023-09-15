const DotIndicator: React.FC<any> = ({ total, active }) => {
  const GetItems = () => {
    const items = [];
    // tslint:disable-next-line: no-increment-decrement
    for (let i = 0; i < total; i++) {
      if (i < active) {
        items.push(<li key={i} className="visited"></li>);
      } else if (active === i) {
        items.push(<li key={i} className="active"></li>);
      } else {
        items.push(<li key={i}></li>);
      }
    }

    return items;
  };
  return (
    <div className="dot-indicator">
      <ul>{GetItems()}</ul>
    </div>
  );
};

export default DotIndicator;
