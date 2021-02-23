<template>
    <div>
        <a-card :bordered="false">
            <a-form layout="inline" :form="searchForm">
                <div class='text-right'>
                    <a-form-item>
                        <a-button type="primary" @click="add">新增</a-button>
                    </a-form-item>
                    <a-form-item>
                        <a-button type="primary" @click="edit">修改</a-button>
                    </a-form-item>
                    <a-form-item>
                        <a-button type="primary" @click="onDelete">删除</a-button>
                    </a-form-item>
                    <a-form-item>
                        <a-button type="primary" ghost @click="search">搜索</a-button>
                    </a-form-item>
                    <a-form-item>
                        <a-button type="default" @click="reset">清空</a-button>
                    </a-form-item>
                </div>
                <a-form-item label="部门名">
                    <a-input placeholder="请输入" v-decorator="['searchName']"/>
                </a-form-item>
            </a-form>
        </a-card>
        <a-card :bordered="false" class='marginT20'>
            <a-row :gutter="20">
                <a-col :span='8'>
                    <a-tree @expand="onExpand" :expandedKeys="expandedKeys" :autoExpandParent="autoExpandParent" @select="onSelect" :selectedKeys="selectedKeys" :treeData="treeData"/>
                </a-col>
                <a-col :span='16'>
                    <a-form layout="horizontal" :form="form">
                        <a-form-item label="主键" v-show="false">
                            <a-input  placeholder="请输入" v-decorator="['id']" />
                        </a-form-item>
                        <a-form-item label="版本号" v-show="false">
                            <a-input  placeholder="请输入" v-decorator="['version']"/>
                        </a-form-item>
                        <a-form-item label="父主键" v-show="false">
                            <a-input  placeholder="请输入" v-decorator="['parentId']" />
                        </a-form-item>
                        <a-form-item label="名称" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }" >
                            <a-input placeholder="请输入" v-decorator="['name', {rules: [{ required: true, message: '请输入名称' }]}]" :disabled="formDisabled"/>
                        </a-form-item>
                        <a-form-item label="编码" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }" >
                            <a-input placeholder="请输入" v-decorator="['code', {rules: [{ required: true, message: '请输入编码' }]}]" :disabled="formDisabled"/>
                        </a-form-item>
                        <a-form-item label="备注" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }" >
                            <a-textarea placeholder="请输入" autoSize v-decorator="['memo']" :disabled="formDisabled"/>
                        </a-form-item>
                        <a-form-item class='text-right' :wrapper-col="{ span: 19 }" >
                            <a-button type="primary" @click="save" :disabled="formDisabled">
                                保存
                            </a-button>
                        </a-form-item>
                    </a-form>
                </a-col>
            </a-row>
        </a-card>
    </div>
</template>
<script>
const getParentKey = (key, tree) => {
	let parentKey
	for (let i = 0; i < tree.length; i++) {
		const node = tree[i]
		if (node.children) {
			if (node.children.some(item => item.key === key)) {
				parentKey = node.key
			} else if (getParentKey(key, node.children)) {
				parentKey = getParentKey(key, node.children)
			}
		}
	}
	return parentKey
}
const dataList = []
const generateList = (data) => {
	if (data !== null) {
		for (let i = 0; i < data.length; i++) {
			const node = data[i]
			const key = node.key
			const title = node.title
			dataList.push({ key, title: title })
			if (node.children) {
				generateList(node.children, node.key)
			}
		}
	}
}
export default {
	data () {
			return {
				form: this.$form.createForm(this),
				searchForm: this.$form.createForm(this),
				autoExpandParent: true,
				formDisabled: true,
				expandedKeys: [],
				selectedKeys: [],
				treeData: [],
				loading: false,
				nodeData: []// 树选择后其所有数据
			}
	},
	created () {
		this.getTree()
	},
	methods: {
		// 获取部门树
		getTree () {
			this.loading = true
			this.$get('/department/tree').then((data) => {
				if(data.code==200){
					this.treeData = data.data
					generateList(this.treeData)
				}
			})
		},
		// 树选择
		onSelect (selectedKeys, info) {
			this.selectedKeys = selectedKeys
			this.form.resetFields()
			this.formDisabled = true
			if (selectedKeys.length !== 0) {
				this.edit()
				this.nodeData = info.node.dataRef.model
			} else {
				this.nodeData = []
			}
		},
		// 树展开
		onExpand  (expandedKeys) {
			this.expandedKeys = expandedKeys
			this.autoExpandParent = false
		},
		// 搜索树
		search () {
			const value = this.searchForm.getFieldValue('searchName')
			const expandedKeys = dataList.map((item) => {
				if (item.title.indexOf(value) > -1) {
				return getParentKey(item.key, this.treeData)
				}
				return null
			}).filter((item, i, self) => item && self.indexOf(item) === i)
			Object.assign(this, {
				expandedKeys,
				searchValue: value,
				autoExpandParent: true
			})
			if (expandedKeys.length == 0) {
				this.$message.warning('未查询到数据！')
			}
		},
		// 清空树搜索
		reset () {
			this.searchForm.resetFields()
		},
		// 新增树节点
		add () {
			this.formDisabled = false
			this.okBtn = 0
			this.form.resetFields()
			setTimeout(() => {
				this.form.setFieldsValue({
					parentId: this.nodeData.id
				})
			})
		},
		// 保存树时接口和标题设置
		save () {
			if (this.okBtn !== 0) {
				var url = '/department/update'
				this.saveAction(url, '修改')
			} else {
				var url = '/department/create'
				this.saveAction(url, '新增')
			}
		},
		// 修改
		edit () {
			this.okBtn = 1
			if (this.selectedKeys.length == 0) {
				this.$message.success('请选择要修改的部门！')
				this.formDisabled = true
			} else {
				this.formDisabled = false
				setTimeout(() => {
				this.form.setFieldsValue({
					id: this.nodeData.id,
					parentId: this.nodeData.parentId,
					name: this.nodeData.name,
					code: this.nodeData.code,
					memo: this.nodeData.memo,
					version: this.nodeData.version
				})
				}, 0)
			}
		},
		// 保存请求
		saveAction (url, title) {
			var that = this
			this.$confirm({
				title: '是否要' + title + '?',
				content: '',
				okText: '确定',
				okType: 'primary',
				cancelText: '取消',
				onOk () {
					that.form.validateFieldsAndScroll((err, values) => {
						if (!err) {
							that.$post(url, that.$qs.stringify(that.form.getFieldsValue())).then(data => {
								if(data.code==200){
									that.getTree()
									that.form.resetFields()
									that.formDisabled = true
								}
							}).catch(err => {
								console.log(err)
							})
						}
					})
				},
				onCancel () {
				}
			})
		},
		// 删除树节点
		onDelete () {
			if (this.nodeData.children && this.nodeData.children.length !== 0) {
				this.$message.error('该节点还有子节点，请先删除子节点！')
				return
			}
			if (this.selectedKeys !== '') {
				var that = this
				this.$confirm({
					title: '是否要删除该部门?',
					content: '',
					okText: '确定',
					okType: 'primary',
					cancelText: '取消',
					onOk () {
						that.$axios.delete(`/department/remove?id=${that.nodeData.id}&version=${that.nodeData.version}`).then(data => {
							if(data.data.code==200){
								that.getTree()
								that.formDisabled = true
							}
						}).catch(err => {
							console.log(err)
						})
					},
					onCancel () {
					}
				})
			} else {
				this.$message.error('请选择要删除的部门！')
			}
		}
	}
}
</script>
<style>

</style>
