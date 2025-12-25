/**
 * 智能枚举管理工具
 *
 * @description
 * 提供统一的枚举定义方式，支持业务逻辑（选项列表）与 UI 表现（标签样式）的融合。
 */

export interface EnumItem {
  /** 业务代码 */
  code: number;
  /** 显示标签 */
  label: string;
  /** Badge 变体 (可选) */
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

/**
 * 智能枚举类
 *
 * @example
 * const STATUS = new SmartEnum([
 *   { code: 0, label: '禁用', variant: 'secondary' },
 *   { code: 1, label: '启用', variant: 'default' }
 * ]);
 *
 * // 获取下拉选项
 * const options = STATUS.options;
 *
 * // 获取单个配置
 * const config = STATUS.get(1);
 */
export class SmartEnum<T extends EnumItem> {
  constructor(public readonly items: readonly T[]) {}

  /**
   * 获取用于下拉框的选项列表
   */
  get options(): { code: number; desc: string }[] {
    return this.items.map((item) => ({
      code: item.code,
      desc: item.label
    }));
  }

  /**
   * 根据代码获取枚举项配置
   * @param code 业务代码
   */
  get(code: number): T | undefined {
    return this.items.find((item) => item.code === code);
  }

  /**
   * 根据代码获取显示标签
   */
  getLabel(code: number): string {
    return this.get(code)?.label || '';
  }
}
