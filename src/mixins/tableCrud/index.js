export const tableCrud = {
    data() {
        return {
            searchForm: this.$form.createForm(this, {
                name: 'searchForm'
            }),
            tableData: [],
            current: 1,
            total: 1,
            pageSize: 10,
            loading: true,
            editData: {},//修改数据回显的数据
			okBtn: 'add',//新增add 修改edit
			visible: false,
            modalTitle: '',//弹窗标题
        }
    },
    watch: {
        current() {
            this.getTableData()
        },
        pageSize() {
            this.getTableData()
        }
    },
    methods: {
        //打开新增修改弹窗
        addEdit(type, datas) {
			this.visible = true;
			this.okBtn = type
			this.editData = datas || {}
            this.modalTitle = type == 'edit' ? '修改' : '新增'
            this.$nextTick(() => {
                this.$refs.addEditForm.resetFields()
                if (datas) {
                    this.$refs.addEditForm.setFieldsValue(datas)
                }
            })
		},
		handelCancel() {
			this.visible=false
        },
        //批量删除
        deleteDatas(message, params) {
            if (this.selectedRowKeys.length != 0) {
                var that = this;
                this.confirmTips(message, function () {
                    that.$axios.post(that.deleteUrl, that.$qs.stringify(params)).then(data => {
                        that.spinning = false
                        if (data.data.code == 200) {
                            that.$message.success(data.data.message);
                            that.search();
                        }
                    });
                })
            } else {
                this.$message.warning('请选择要删除的数据！')
            }
        },
        //删除单条数据
        deleteData(message, params) {
            var that = this;
            this.confirmTips(message, function () {
                that.$axios.post(that.deleteUrl, that.$qs.stringify(params)).then(data => {
                    that.spinning = false
                    if (data.data.code == 200) {
                        that.$message.success(data.data.message);
                        that.search();
                    }
                });
            })
        },
        confirmTips(message, callback) {
            this.$confirm({
                title: "提示",
                content: message,
                okText: "确认",
                cancelText: "取消",
                onOk() {
                    callback()
                },
                onCancel() { }
            });
        },
        getTableDataAjax(params) {
            this.loading = true;
            this.$axios.get(this.listUrl, { params: params }).then((data) => {
                this.loading = false
                if (data.data.code == 200) {
                    this.tableData = data.data.data ? data.data.data.items : [];
                    this.total = data.data.data.count>0? data.data.data.count : 0;
                }
            });
        },
        search() {
            this.current = 1
            this.getTableData()
        },
        reset() {
            this.searchForm.resetFields();
            this.search()
        },
    }
}