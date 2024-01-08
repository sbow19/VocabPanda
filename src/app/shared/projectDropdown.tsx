/* eslint-disable */

import { Dropdown } from 'react-native-element-dropdown';

/* TODO - move this to a shared assets file and use across app */
const ProjectDropdown: React.FC = props=>{

    /* Fetch  current project data -- move functionality to database folder */

    const data: ProjectList = [
        {
            label: "my project",
            value: 1
        },
        {
            label: "second project",
            value: 2
        },
        {
            label: "third project",
            value: 3
        }
    ];

    const [currentSelection, handleUserSelection] = props.mySelectState

    return(
        <Dropdown
        data={data}
        labelField= "label"
        valueField= "value"
        searchField= "label"
        placeholder={!currentSelection ? "Search projects...": currentSelection}
        searchPlaceholder='Type...'
        value = {currentSelection}
        onChange={item=>{

            console.log(currentSelection)

            handleUserSelection(item.label);


        }}
        onChangeText = {search =>{

            console.log(search)
        }
        }
        style={{ backgroundColor:"black"}}
        containerStyle={{backgroundColor: "black", borderRadius:10, height: 250}}
        search={true}
        activeColor='grey'

            />
    )
}


type ProjectList = Array<ListObject|null>
type ListObject = {
    label: string
    value: number
}

export default ProjectDropdown
