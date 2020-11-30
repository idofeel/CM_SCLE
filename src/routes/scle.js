import React, { Component } from "react";
import Script from "react-load-script";
import Tools from "../utils/loadScript";


export default class ScleContainer extends Component {
    static defaultProps = {
        onLoaded: () => { },
    };
    constructor(props) {
        super(props)
        this.state = {
            script: [],
            syncScript: [],
        }
        // 加载的长度
        this.loadLength = 0
    }

    async componentDidMount() {
        this.getScriptConfig()
    }

    // 渲染
    render() {
        const { script } = this.state;
        if (script.length === 0) return null
        return <>
            {/* 加载script */}
            {script.map((item, index) => {
                return (
                    <Script
                        key={index}
                        url={item.url}
                        onCreate={this.handleScriptCreate.bind(this, item)}
                        onError={this.handleScriptError.bind(this, item)}
                        onLoad={this.handleScriptLoad.bind(this, item)}
                    />
                );
            })}
        </>
    }

    handleScriptCreate() {

    }

    handleScriptError(item) {
        new Error(`loadscript ${item.url} faild, 请检查路径`)
    }
    // 获取js脚本配置
    async getScriptConfig() {
        if (window.importScripts) {
            const { asyncScript = [], syncScript = [] } = window.importScripts
            this.setState({
                script: asyncScript,
                syncScript
            })
        }
        // const res = await request('./scleConfig.json')
        // if (res.data && Object.keys(res.data).length) {
        //     const { asyncScript = [], syncScript = [] } = res.data
        //     this.setState({
        //         script: asyncScript,
        //         syncScript
        //     })
        // } else {
        //     message.error('获取SCLESCRIPT失败')
        //     new Error(`GET SCLESCRIPT FAILD`)
        // }
    }

    // 加载scpirt
    handleScriptLoad() {
        this.loadLength++
        if (this.loadLength === this.state.script.length) {
            this.scriptLoaded()
        }
    }
    // js 加载完成
    scriptLoaded() {
        this.loadAsyncScript()
    }

    // 加载异步脚本
    loadAsyncScript() {
        Tools.syncLoadScripts(this.state.syncScript, () => {
            this.props.onLoaded();
        });
    }
    // componentWillUnmount
    componentWillUnmount() {
    }

}