import React, { Component, PureComponent } from 'react';
import { Drawer, message, Progress } from 'antd'
import { queryString } from '../utils';
import Scle from './scle'
import './scle.less'
import SCLE_CONTROLLER from './scleControl';
import ScleToolsBar from './scleTools/scleToolsBar';

const logo = require('../assets/images/downloadAppIcon.png')

export default class scleView extends PureComponent {
    constructor(props) {
        super(props)
        this.SCLE = new SCLE_CONTROLLER({
            onProgress: this.onProgress.bind(this)
        })
    }
    state = {
        loading: true,
        percent: 0
    }
    render() {
        return (
            <div className="container">
                {
                    this.state.loading && <div className="scle_loading" >
                        <div className="scle_loadImg">
                            <img src={logo} />
                            <Progress strokeColor={{
                                '0%': '#108ee9',
                                '100%': '#87d068',
                            }}
                                percent={this.state.percent} />
                        </div>

                    </div>
                }

                <>
                    <canvas id="glcanvas" width="800" height="600"></canvas>
                    <canvas id="text" width="800" height="600"></canvas>
                </>
                <ScleToolsBar></ScleToolsBar>
                {/* <Scle onLoaded={() => this.onReady()} /> */}
            </div>
        );
    }

    componentDidMount() {
        this.openScle()
    }

    // 脚本全部加载完成
    onReady() {
        let custom = new CustomEvent('scleloaded', { detail: {} })
        window.dispatchEvent(custom)
        this.openScle()
    }

    // 打开scle 文件
    openScle() {
        const { pid, title, link, lic } = queryString(window.location.href)
        console.log(link);
        document.title = title || '三维模型'
        if (link) {
            this.openLink(link);
            return
        } else {
            message.warning('请输入正确的链接')
        }
    }

    onProgress(evt) {
        if (evt.lengthComputable) {
            let percentComplete = evt.loaded / evt.total;
            /* eslint-disable */
            g_nCleBufferlength = evt.total;
            // g_loaded_pos = evt.loaded;

            this.setState({
                percent: Math.floor(percentComplete * 100)
            })

            if (percentComplete === 1) {
                this.setState({
                    loading: false
                }, window.canvasOnResize)
            }
        }
    }
    // 从link 打开
    openLink(link) {
        window.g_strResbaseUrl = link.replace(/(.scle|.zip)$/, '/');
        this.SCLE.getByRequest(link)
    }
}


// class scleView extends SCLE_CONTROLLER extends Component{

// }