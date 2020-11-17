import React, { PureComponent } from 'react';
import { Progress } from 'antd'
import { queryString } from '../utils';
import Scle from './scle'
import './scle.less'
import { getByRequest } from './scleControl';

const logo = require('../assets/images/downloadAppIcon.png')


export default class scleView extends PureComponent {
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
                {/* loading */}

                <Scle onLoaded={() => this.onReady()} />
            </div>
        );
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
        }
    }
    // 从link 打开
    openLink(link) {
        window.g_strResbaseUrl = link.replace(/(.scle|.zip)$/, '/');
        getByRequest(link)
        this.setState({
            loading: false
        }, window.canvasOnResize)
    }
}
