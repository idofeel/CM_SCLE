import { Affix, Icon, Tabs, } from 'antd';
import { PureComponent } from 'react';

import './scleTools.less'

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1616415_x0co1i09pnp.js',
});
const { TabPane } = Tabs

export default class scleTools extends PureComponent {
    state = {
        activeTab: null
    }
    render() {
        return <Affix offsetBottom={10}>
            <Tabs activeKey={this.state.activeTab} tabPosition="bottom" onChange={activeTab => this.setState({ activeTab })}>
                {this.renderTools()}
            </Tabs>
        </Affix>
    }
    renderTools() {
        const tools = [
            { icon: 'home', click: window.setHome },
            { icon: 'drag', },
            { icon: 'apartment', },
            { icon: 'eye', },
            { icon: 'bg-colors' },
            { icon: 'icon-toumingdu', isFont: true },
            { icon: 'icon-background-l', isFont: true },
            { icon: 'icon-box', isFont: true },
            {
                icon: 'play-circle', click: () => { console.log('????'); window.setAnimationStart() }
            },
            { icon: 'fullscreen', },

        ]

        return tools.map(item => (
            <TabPane tab={
                item.isFont ?
                    <IconFont
                        type={item.icon}
                        onClick={item.click}
                    /> : <Icon type={item.icon} onClick={item.click} />

            } key={item.icon} >

            </TabPane>
        ))
    }
}