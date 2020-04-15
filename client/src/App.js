import React from 'react';
import './App.scss';
import Locate from './components/locate/Locate'
import Add from './components/add/Add'
import Update from './components/update/Update'
import Inventory from './components/inventory/Inventory';
import * as utils from './utils/utils'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs: ['Locate', 'Add', 'Update', 'View Inventory'],
            activeTab: 'Locate'
        }
    }

    handleTabClick = (e) => {
        this.setState({ activeTab: e.target.id })
    }

    tabActive = (tabName) => {
        if (tabName === this.state.activeTab) return true
        else return false
    }

    render() {
        const { tabs, activeTab } = this.state;
        return (
            <div id="App">
                <section id="center-content">
                    <section id="sidebar-container">
                        {tabs.map((tab, index) =>
                            <div className="tab"
                                key={index}
                                id={tab}
                                style={activeTab === tab ? utils.tabSelectedStyling : {}}
                                onClick={this.handleTabClick}>
                                {tab}
                            </div>
                        )}
                    </section>
                    <section id="content-container">
                        {this.tabActive('Locate') && < Locate />}
                        {this.tabActive('Add') && < Add />}
                        {this.tabActive('Update') && < Update />}
                        {this.tabActive('View Inventory') && < Inventory />}
                    </section>
                </section>
            </div >
        );
    }
}

export default App;