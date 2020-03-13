import React from 'react';
import './App.scss';
import Add from './components/add/Add'
// import * as utils from './utils/styling'


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs: ['Locate', 'Add', 'Remove', 'Edit', 'View Inventory']
        }
    }

    handleTabClick(tabIndex) {
        console.log(tabIndex)
    }



    render() {
        const { tabs } = this.state;
        return (
            <div id="App">
                <section id="sidebar-container">
                    {tabs.map((tab, index) =>
                        <div className="tab"
                            key={index}
                            onClick={() => this.handleTabClick(index)}>
                            {tab}
                        </div>
                    )}
                </section>
                <section id="content-container">

                    < Add />
                </section>
            </div>
        );
    }
}

export default App;