<script lang="tsx">
import { ElSpace, ElButton, ElTooltip } from 'element-plus'
import { defineComponent, PropType } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { TableColumnActionIcon } from '@/types/table'
import { useIcon } from '@/hooks/web/useIcon'

export default defineComponent({
  name: 'TableEditColumn',
  props: {
    row: propTypes.any,
    size: propTypes.oneOf(['large', 'small', 'default']).def('small'),
    // 是否显示编辑按钮
    edit: propTypes.bool.def(true),
    // 是否显示删除按钮
    delete: propTypes.bool.def(true),
    // 图标定义
    icons: {
      type: Array as PropType<TableColumnActionIcon[]>,
      default: () => []
    },
    buttonType: propTypes.oneOf(['plain', 'round', 'circle', 'default']).def('circle'),
    viewType: propTypes.oneOf(['link', 'default']).def('default')
  },
  emits: ['edit', 'delete'],
  setup(props, { emit }) {
    const renderIcons = () => {
      const icons = [...props.icons]
      if (props.edit) {
        icons.push({
          icon: 'ant-design:edit-outlined',
          type: 'primary',
          tooltip: '编辑',
          action: () => emit('edit', props.row)
        })
      }
      if (props.delete) {
        icons.push({
          icon: 'ant-design:delete-outlined',
          tooltip: '删除',
          type: 'danger',
          action: () => emit('delete', props.row)
        })
      }

      return icons.map((x) => {
        return x.tooltip ? (
          <ElTooltip content={x.tooltip} placement="top">
            {props.viewType === 'default' ? (
              <ElButton
                size="small"
                circle={props.buttonType === 'circle'}
                round={props.buttonType === 'round'}
                plain={props.buttonType === 'plain'}
                {...x}
                onClick={() => x.action?.call(null, props.row)}
                icon={useIcon({ icon: x.icon })}
              />
            ) : (
              <ElButton
                size="small"
                circle={props.buttonType === 'circle'}
                round={props.buttonType === 'round'}
                plain={props.buttonType === 'plain'}
                {...x}
                onClick={() => x.action?.call(null, props.row)}
                icon={''}
                link
              >
                {x.tooltip}
              </ElButton>
            )}
          </ElTooltip>
        ) : (
          <ElButton
            size="small"
            circle={props.buttonType === 'circle'}
            round={props.buttonType === 'round'}
            plain={props.buttonType === 'plain'}
            {...x}
            onClick={() => x.action?.call(null, props.row)}
            icon={useIcon({ icon: x.icon })}
          />
        )
      })
    }
    return () => <ElSpace wrap>{renderIcons()}</ElSpace>
  }
})
</script>
