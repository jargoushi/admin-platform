/**
 * 用户数据表格组件
 *
 * @description
 * 显示用户列表
 */

'use client';

import { useMemo } from 'react';
import { DataTable, type Column } from '@/components/table/data-table';
import type { User } from '../types';

/**
 * 表格组件属性
 */
interface UserTableProps {
  data: User[];
  loading?: boolean;
}

export function UserTable({ data, loading = false }: UserTableProps) {
  /** 列配置 */
  const columns = useMemo<Column<User>[]>(
    () => [
      {
        key: 'id',
        title: 'ID',
        className: 'w-[80px]'
      },
      {
        key: 'username',
        title: '用户名',
        className: 'min-w-[120px] font-medium'
      },
      {
        key: 'phone',
        title: '手机号',
        className: 'w-[140px]',
        render: (value) => value || '-'
      },
      {
        key: 'email',
        title: '邮箱',
        className: 'w-[200px]',
        render: (value) => value || '-'
      },
      {
        key: 'activation_code',
        title: '激活码',
        className: 'min-w-[280px] font-mono'
      },
      {
        key: 'created_at',
        title: '注册时间',
        className: 'w-[180px]'
      }
    ],
    []
  );

  return (
    <DataTable columns={columns} data={data} loading={loading} rowKey='id' />
  );
}
