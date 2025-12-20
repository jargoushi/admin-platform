/**
 * 浏览器管理模块类型 definition
 */

import { PageResponse } from '@/lib/http';

/**
 * 浏览器指纹对象
 */
export interface BrowserFingerPrint {
    coreProduct?: string;
    coreVersion?: string;
    ostype?: string;
    os?: string;
    osVersion?: string;
    userAgent?: string;
    openWidth?: number;
    openHeight?: number;
    [key: string]: any;
}

/**
 * 浏览器列表项
 */
export interface BrowserListItem {
    id: string;
    name: string;
    status: number; // 0: 未打开, 1: 已打开, 2: 异常
    seq: number;
    proxyType?: string;
    host?: string;
    port?: number;
    createdTime?: string;
    [key: string]: any;
}

/**
 * 浏览器详情
 */
export interface BrowserDetail extends BrowserListItem {
    browserFingerPrint?: BrowserFingerPrint;
}

/**
 * 浏览器列表查询参数
 */
export interface BrowserListRequest {
    page?: number;
    size?: number;
    groupId?: string;
    name?: string;
    [key: string]: string | number | undefined;
}

/**
 * 打开浏览器窗口请求
 */
export interface BrowserOpenRequest {
    ids: string[];
    args?: string[];
    ignoreDefaultUrls?: boolean;
    newPageUrl?: string;
}

/**
 * 打开窗口单项结果
 */
export interface BrowserOpenResponse {
    ws: string;
    http: string;
    name: string;
    remark: string;
    groupId?: string;
}

/**
 * 批量打开结果项
 */
export interface BatchOpenResult {
    id: string;
    success: boolean;
    data?: BrowserOpenResponse;
    error?: string;
}

/**
 * 批量打开浏览器响应
 */
export interface BrowserBatchOpenResponse {
    results: BatchOpenResult[];
    total: number;
    success_count: number;
    fail_count: number;
}

/**
 * 窗口排列请求
 */
export interface WindowArrangeRequest {
    seqlist?: number[];
}
