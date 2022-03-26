import { ComponentInternalInstance, getCurrentInstance } from 'vue';

/**
 * 获得当前vue实例
 */
export default function useCurrentInstance() {
    const { appContext } = getCurrentInstance() as ComponentInternalInstance;
    const proxy = appContext.config.globalProperties;
    return {
        proxy
    };
}
