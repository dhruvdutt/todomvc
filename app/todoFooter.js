// Based on: https://github.com/tastejs/todomvc/blob/gh-pages/examples/react/js/footer.jsx

import React, { Component } from "react";
import classNames from "classnames";
import {
  ToggleButton,
  ReactiveElement,
  DataController
} from "@appbaseio/reactivesearch";

import Utils from "./utils";
import { routerInstance } from './todoApp';

const ALL_TODOS = "all";
const ACTIVE_TODOS = "active";
const COMPLETED_TODOS = "completed";

class TodoFooter extends Component {

  onAllData (data) {
    // merging all streaming and historic data
    var todosData = Utils.mergeTodos(data);

    let activeTodoCount = todosData.reduce((accum, todo) => {
      return todo._source.completed ? accum : accum + 1
    }, 0)

    let activeTodoWord = Utils.pluralize(activeTodoCount, "item");

    return(
      <span className="todo-count">
        <strong>{activeTodoCount}</strong> {activeTodoWord} left
      </span>
    )
  }

  render () {
    let clearButton = null;
    let { completedCount, onClearCompleted, nowShowing } = this.props;

    if (completedCount > 0) {
      clearButton = (
        <button
          className="clear-completed"
          onClick={onClearCompleted}>
          Clear completed
        </button>
      )
    }

    return (
      <footer className="footer">
        <DataController
          componentId="ActiveCountSensor"
          visible={false}
          showFilter={false}
          customQuery={
            function(value) {
              return {
                query: {
                  match_all: {}
                }
              }
            }
          }
        />
        <ReactiveElement
          componentId="ActiveCount"
          stream={true}
          showResultStats={false}
          onAllData={this.onAllData.bind(this)}
          react={{
            or: ["ActiveCountSensor"]
          }}
        />
        <ul className="filters">
          <ToggleButton
            componentId="FiltersSensor"
            dataField="completed"
            defaultSelected={[nowShowing]}
            multiSelect={false}
            onValueChange={
              function(val) {
                routerInstance.setRoute("/" + val[0].value)
              }
            }
            customQuery={
              function(data) {
                let val;
                if (Array.isArray(data)) {
                  val = data[0].value;
                }
                const completed = (val === "completed") ? true : (val === "active") ? false : "all";

                console.log("@customQuery: completed:", completed, "data:", data);

                // if (completed === "all") {
                  return {
                    query: {
                      match_all: {}
                    }
                  }
                // }

                // return {
                //   "query": {
                //     "bool": {
                //       "must": [
                //         {
                //           "match": {
                //             "completed": completed
                //           }
                //         }
                //       ]
                //     }
                //   }
                // }
              }
            }
            data={
              [
                {"label": "all",        "value": "all"},
                {"label": "active",     "value": "active"},
                {"label": "completed",  "value": "completed"}
              ]
            }
          />
        </ul>
        {clearButton}
      </footer>
    )
  }
}

export default TodoFooter;
