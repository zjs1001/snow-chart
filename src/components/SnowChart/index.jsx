import React, { useReducer } from "react";
import SnowflakeChart from "./components/SnowflakeChart";
import DataEditor from "./components/DataEditor";
import HighlightedOption from "./components/HighlightedOption";
import ResetButton from "./components/ResetButton";
const initialData = [
  {
    name: "value",
    label: "VALUE",
    value: 3,
    description:
      "Does the company pay a good, reliable and sustainable dividend?",
    section: [true, true, false, false, false, false],
  },
  {
    name: "future",
    label: "FUTURE",
    value: 7,
    description:
      "How is the company forecast to perform in the next 1-3 years?",
    section: [true, true, true, true, true, true],
  },
  {
    name: "past",
    label: "PAST",
    value: 5,
    description:
      "Does the company have strong financial health and manageable debt?",
    section: [false, true, true, true, false, true],
  },
  {
    name: "health",
    label: "HEALTH",
    value: 7,
    description: "How has the company performed over the past 5 years?",
    section: [true, true, true, true, true, true],
  },
  {
    name: "dividend",
    label: "DIVIDEND",
    value: 1,
    description:
      "Is the company undervalued compared to its peers, industry and forecasted cash flows?",
    section: [false, false, false, false, false, false],
  },
];
function reducer(state, action) {
  if (action.type === "reset") {
    return { data: initialData, highlightIndex: -1 };
  }
  if (action.type === "highlight") {
    console.log('action',action)
    return { ...state, highlightIndex: action.payload.value };
  }
  return { ...state, data: state.data.map((item) => {
    if (item.name === action.type) {
      return { ...item, value: action.payload.value };
    }
    return item;
  }) };
}
const Snowflake = () => {
  const [state, dispatch] = useReducer(reducer, {
    data: initialData,
    highlightIndex: -1,
  });
  const updateData = (name, value) => {
    dispatch({
      type: name,
      payload: {
        value,
      },
    });
  };
  return (
    <div className="container">
      <DataEditor data={state.data} updateData={updateData} />
      <HighlightedOption data={state} updateHighlight={updateData} />
      <ResetButton reset={() => dispatch({ type: "reset" })} />
      <SnowflakeChart data={state} />
    </div>
  );
};

export default Snowflake;
