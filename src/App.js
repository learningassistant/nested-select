import React from 'react';
import { 
  MdCheckBoxOutlineBlank, 
  MdCheckBox, 
  MdIndeterminateCheckBox,
  MdFolder,
  MdFolderOpen,
  MdAssignment,
} from 'react-icons/md';

import './App.css';

const data = [
  {
    name: "Introduction",
    id: "Introduction-id",
    children: [
      {
        name: "Pack 1",
        id: "Pack-1-id",
        children: [
          {
            name: "Part 1",
            id: "Part-1-id",
            children: [
              {
                name: "Assignment",
                id: "Part-1-Child-1-id",
                children: [
                  {
                    name: "Complete and Upload",
                    id: "Part-1-Child-1-Child-1-id",
                    children: []
                  }
                ]
              },
              {
                name: "Reviews",
                id: "Part-1-Child-2-id",
                children: [
                  {
                    name: "Complete and Upload",
                    id: "Part-1-Child-2-Child-1-id",
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: "Criteria",
        id: "Pack-2-id",
        children: []
      }
    ]
  },
  {
    name: "1 Deep",
    id: "1-deep-id",
    children: [
      {
        name: "Child",
        id: "1-deep-child-id",
        children: []
      },
    ],
  },
  {
    name: "2 Deep",
    id: "2-deep-id",
    children: [
      {
        name: "level 2",
        id: "2-deep-level-2-id",
        children: [
          {
            name: "level 3",
            id: "2-deep-level-3-id",
            children: []
          },
        ],
      },
    ],
  },
  {
    name: "3 Deep",
    id: "3-deep-id",
    children: [
      {
        name: "level 2",
        id: "3-deep-level-2-id",
        children: [
          {
            name: "level 3",
            id: "3-deep-level-3-id",
            children: [
              {
                name: "level 3",
                id: "3-deep-level-3-id",
                children: []
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "4 Deep",
    id: "4-deep-id",
    children: [
      {
        name: "level 2",
        id: "4-deep-level-2-id",
        children: [
          {
            name: "level 3",
            id: "4-deep-level-3-id",
            children: [
              {
                name: "level 4",
                id: "4-deep-level-4-id",
                children: []
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "5 Deep",
    id: "5-deep-id",
    children: [
      {
        name: "level 2",
        id: "5-deep-level-2-id",
        children: [
          {
            name: "level 3",
            id: "5-deep-level-3-id",
            children: [
              {
                name: "level 4",
                id: "5-deep-level-4-id",
                children: [
                  {
                    name: "level 5",
                    id: "5-deep-level-5-id",
                    children: []
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }
]

const OptionsList = ({ options, selectedOptions, expandedOptions, onChange }) => {
 
  const expandList = (expandedOptionId) => {
    if(expandedOptions[expandedOptionId]){
      delete expandedOptions[expandedOptionId]; 
    } else {
      expandedOptions[expandedOptionId] = {};
    }
    onChange(selectedOptions, expandedOptions);
  }
 
  const handleCheckboxClicked = (option) => {
    if(selectedOptions[option.id]){
      delete selectedOptions[option.id]; 
    } else {
      // Recursively select all children as well from parent
      let selectChildren = (opt, selected) => {
        selected[opt.id] = {};

        if (opt.children.length) {
          opt.children.map((c) => {
            selectChildren (c, selected[opt.id]);
          })
        }
      }
      selectChildren(option, selectedOptions);
    }
    onChange(selectedOptions, expandedOptions);
  }
  
  const handleChildrenListChange = (optionId, subSelected, subExpanded) => {
    if (Object.entries(subSelected).length) {
      selectedOptions[optionId] = subSelected;
    }
    if (Object.entries(subExpanded).length) {
      expandedOptions[optionId] = subExpanded;
    }
    
    onChange(selectedOptions, expandedOptions);
  }
  
  const checkChildrenSelected = (options, parent) => {
    let selected = options[parent.id] && parent.children && 
      Object.entries(parent.children).length === Object.entries(options[parent.id]).length;

    if (selected && Object.entries(parent.children).length) {
      parent.children.map((c) => {
        if (selected) {
          selected = checkChildrenSelected(options[parent.id], c);
        }
      })
    }

    return selected;
  }
  
  return (
    <ul className={'list'}>
      {options.map(option => (
        <li>
          <div className={'list-checkbox'}>
            <Checkbox
              className={'list-checkbox'}
              allChildrenSelected={checkChildrenSelected(selectedOptions, option)} 
              selected={selectedOptions && selectedOptions[option.id]} 
              onChange={() => {handleCheckboxClicked(option)}}
            />
          </div>
          {
            option.children.length > 0 && 
            <Folder 
              expanded={expandedOptions && expandedOptions[option.id]}
              onChange={() => {expandList(option.id)}}
              label={option.name}
            />
          }
          {
            option.children.length === 0 && 
            <div><MdAssignment />{option.name}</div>
          }
          {(option.children.length > 0 && expandedOptions[option.id]) &&
            <OptionsList
              options={option.children}
              selectedOptions={selectedOptions[option.id] || {}} 
              expandedOptions={expandedOptions[option.id] || {}} 
              onChange={(subSelected, subExpanded) => handleChildrenListChange(option.id, subSelected, subExpanded)}
            />
          }
        </li>
      ))}
    </ul>
  )
}

const Folder = ({ expanded, label, onChange }) => {
  if (expanded) {
    return (
      <div onClick={() => onChange(!expanded)}>
        <MdFolderOpen />
        {label}
      </div>
    );
  }
  return (
    <div onClick={() => onChange(!expanded)}>
      <MdFolder />
      {label}
    </div>
  );
}

const Checkbox = ({ allChildrenSelected, selected, label, onChange }) => {
  
    if (allChildrenSelected) {
      return (
        <MdCheckBox
          onClick={() => onChange(!selected)} 
        />
      ) 
    } else if (selected) { 
      return (
        <MdIndeterminateCheckBox
          onClick={() => onChange(!selected)} 
        />
      )
    }

    return (
      <MdCheckBoxOutlineBlank
        onClick={() => onChange(!selected)} 
      />
    )

}

class App extends React.Component {
  // Basic implentation of app store
  state = {
    selectedOptions: {},
    expandedOptions: {},
  }

  render() {
    console.table(JSON.stringify(this.state.selectedOptions));
    return (
      <div className="App">
        <div style={{float: 'left', width: '60%'}}> {/* Quick wrapper to show the component and data object */}
          <h1> Task Wizard </h1>
          <OptionsList 
            options={data}
            onChange={(selectedOptions, expandedOptions) => this.setState({selectedOptions, expandedOptions})}
            selectedOptions={ this.state.selectedOptions } 
            expandedOptions={ this.state.expandedOptions } 
          />
        </div>
        <div style={{float: 'right'}}>
          <h4>JS Data Object</h4>
          <pre>{JSON.stringify(data, null, 1)}</pre>
        </div>
      </div>
    );
  }
}

export default App;
