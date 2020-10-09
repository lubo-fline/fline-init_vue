<template>
    <div>
        <a-card :bordered="false">
            <a-form layout="inline" :form='searchForm'>
                <div class='text-right'>
                    <a-form-item>
                        <a-button type="primary" @click="getMenuTree">功能权限</a-button>
                    </a-form-item>
                    <a-form-item>
                        <a-button type="primary" @click="add">新增</a-button>
                    </a-form-item>
                    <a-form-item>
                        <a-button type="primary" ghost @click="search">查询</a-button>
                    </a-form-item>
                    <a-form-item>
                        <a-button type="default" @click="reset">清空</a-button>
                    </a-form-item>
                </div>
                <a-form-item label="角色名称：">
                    <a-input placeholder="请输入" v-decorator="['name']"/>
                </a-form-item>
            </a-form>
        </a-card>
        <a-card :bordered="false" class='marginT20'>
            <a-table :columns="columns" :dataSource="tableData" :loading="loading" :rowKey="record => record.id" :pagination="false" size="middle" :rowSelection="rowSelection">
                <template slot="operation" slot-scope="text, record">
                    <a-icon title='修改' type="edit" @click="edit(record)" class="marginR5"/>
                    <a-popconfirm title="是否删除?" @confirm="() => onDelete(record)" okText="是" cancelText="否">
                        <a-icon type="delete"/>
                    </a-popconfirm>
                </template>
                <template slot="createDate" slot-scope="text">
                    <span>{{text.substring(0,10)}}</span>
                </template>
            </a-table>
            <a-pagination size="small" class='pull-right marginT10' v-model="current" :total="total"/>
        </a-card>
        <a-modal :title="modalTitle" :visible="addVisible" @ok="handleOk" :confirmLoading="confirmLoading" @cancel="handleCancel">
            <a-form layout="horizontal" :form="form">
                <a-form-item label="id" v-show="false">
                    <a-input  placeholder="请输入" v-decorator="['id']"/>
                </a-form-item>
                <a-form-item label="版本号" v-show="false">
                    <a-input  placeholder="请输入" v-decorator="['version']"/>
                </a-form-item>
                <a-form-item label="名称:" :label-col="{ span:7 }" :wrapper-col="{ span: 12 }">
                    <a-input  placeholder="请输入" v-decorator="['name',{initialValue:'',rules: [{ required: true, message: '请输入名称' }]}]"/>
                </a-form-item>
                <a-form-item label="描述" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }" >
                    <a-textarea :rows='3'  placeholder="请输入" v-decorator="['description']"></a-textarea>
                </a-form-item>
            </a-form>
        </a-modal>
        <a-modal title="功能权限分配" :bodyStyle='bodyStyle' :visible="powerVisible" @ok="handleOkPower" :confirmLoading="confirmLoading" @cancel="handleCancelPower">
            <a-tree @expand="onExpand" checkable @check="onCheckDoc" checkStrictly  v-model="treeCheckedKeys" :expandedKeys="expandedKeys"  :autoExpandParent="autoExpandParent" :treeData="treeData"/>
        </a-modal>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                bodyStyle:{'height':'400px','overflow':'auto'},
                form: this.$form.createForm(this),
                searchForm: this.$form.createForm(this),
                current:1,
                pageSize:10,
                tableData: [],
                columns : [
                    {
                        title: '名称',
                        dataIndex: 'name',
                        key:'name'
                    }, {
                        title: '编码',
                        dataIndex: 'code',
                    } ,{
                        title: '描述',
                        dataIndex: 'description',
                    } ,{
                        title: '创建人',
                        dataIndex: 'creator',
                    }, {
                        title: '创建时间',
                        dataIndex: 'createDate',
                        scopedSlots: { customRender: 'createDate' }
                    }, {
                        title: '操作',
                        dataIndex: 'id',
                        key:'id',
                        scopedSlots: { customRender: 'operation' }
                    }],
                total:0,
                tableSelectData:{},//表格选择数据
                addVisible:false,//新增修改弹窗显示
                confirmLoading:false,
                modalTitle:'',//新增修改弹窗标题
                okBtn:0,//判断新增修改
                powerVisible:false,
                treeData:[],//菜单树数据
                expandedKeys: [],//菜单树展开数据
                loading:false,
                autoExpandParent: true,
                treeCheckedKeys: [],//菜单树选择数据
            }
        },
        watch:{
            current(val) {
                this.getTableData()
            },
        },
        created(){
            this.getTableData();
        },
        computed: {
            rowSelection() {
                const { selectedRowKeys } = this;
                return {
                    onChange: (selectedRowKeys, selectedRows) => {
                        this.tableSelectData=selectedRows[0]
                    },
                    type:'radio'
                }
            }
        },
        methods:{
            //获取角色表格数据
            getTableData(){
                this.loading = true
                this.$axios.get('/role/page',{
                    params:{
                        pageNum:this.current,
                        pageSize:this.pageSize,
                        name:this.searchForm.getFieldValue('name')
                    }
                }).then((data) => {
                    this.loading = false;
                    if (data.data.code === 200) {
                        this.total = data.data.data?data.data.data.count:0;
                        this.tableData = data.data.data?data.data.data.items:[];
                    }
                });
            },
            //获取所有菜单权限
            getMenuTree() {
                if(JSON.stringify(this.tableSelectData)!=='{}'){
                    this.powerVisible=true
                    this.treeCheckedKeys=[]
                    var permissionIds=this.tableSelectData.permissionIds;
                    if(permissionIds.length>0){
                        permissionIds.forEach(item=>{
                            this.treeCheckedKeys.push(item.toString())
                        })
                    }
                    this.$axios.get('/permission/menu/tree').then((data) => {
                        if (data.data.code === 200) {
                            this.treeData=data.data.data;
                            for(var i=0;i<data.data.data.length;i++){
                                this.expandedKeys.push(data.data.data[i].key)
                            }
                        }
                    });
                }else{
                    this.$message.error('请选择要分配的角色！');
                }
            },
            onExpand  (expandedKeys) {
                this.expandedKeys = expandedKeys
                this.autoExpandParent = false
            },
            //分配菜单权限确认
            handleOkPower(e) {
                e.preventDefault();
                this.confirmLoading = true;
                this.$axios.post('/role/assignPermission', this.$qs.stringify({
                    "roleId": this.tableSelectData.id,
                    "permissionIds": this.treeCheckedKeys,
                }, { indices: false })).then(data => {
                    this.powerVisible = false;
                    this.confirmLoading = false;
                    if (data.data.code === 200) {
                        this.$message.success(data.data.msg);
                        this.getTableData();
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            //分配菜单权限取消
            handleCancelPower(e) {
                this.powerVisible = false
            },
            //树节点选择时，父节点和字节点关联关系（父选择时子不必全选，子选择时父一定选择，父取消子一定取消，子全部取消父不取消）
            onCheckDoc (selectNodes, treeNode) {
                this.treeCheckedKeys = selectNodes.checked//获取所有选中的树的数据
                if(treeNode.checked==false){//取消该节点选择时
                    if(treeNode.node.dataRef.children){//获取它的子元素
                        this.cancelSelectChildNode(treeNode.node.dataRef.children)//在所有选中的数据里去掉其子元素选择
                    }
                }else{//选中该节点时
                    this.selectParentNode(treeNode.node.$parent)//如果父节点没有选中，则要选择父节点
                }
            },
            //取消选中子节点
            cancelSelectChildNode(nodeChildren){
                nodeChildren.forEach(item=>{
                    this.treeCheckedKeys.forEach((element,index)=>{
                        if(item.key==element){
                            this.treeCheckedKeys.splice(index, 1); 
                        }
                    })
                    if(item.children){
                        this.cancelSelectChildNode(item.children)
                    }
                })
            },
            //选择父节点
            selectParentNode(nodeParent){
                if(nodeParent.checked==false){
                    this.treeCheckedKeys.push(nodeParent.$vnode.key)
                    this.selectParentNode(nodeParent.$parent)
                }
            },
            //删除角色
            onDelete (datas) {
                this.$axios.delete(`/role/remove?id=${datas.id}&version=${datas.version}`).then(data=>{
                    if (data.data.code === 200) {
                        this.$message.success(data.data.msg);
                    }
                    this.getTableData();
                }).catch (err=>{
                    console.log(err)
                })
            },
            //新增角色按钮
            add(){
                this.modalTitle='角色新增'
                this.addVisible = true;
                this.okBtn=0;
                this.form.resetFields()
            },
            //修改角色
            edit(datas) {
                this.modalTitle='角色修改'
                this.okBtn=1;
                this.addVisible = true;
                this.form.resetFields()
                setTimeout(() => {
                    this.form.setFieldsValue({
                        id:datas.id,
                        name:datas.name,
                        description:datas.description,
                        version:datas.version,
                    })
                }, 0)
            },
            //新增修改弹窗确认
            handleOk(e) {
                if(this.okBtn==0){
                    var url='/role/create';
                }else{
                    var url='/role/update';
                }
                e.preventDefault();
                this.form.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                        this.confirmLoading = true;
                        this.$axios.post(url, this.$qs.stringify(this.form.getFieldsValue())).then(data => {
                            this.addVisible = false;
                            this.confirmLoading = false;
                            if (data.data.code === 200) {
                                this.$message.success(data.data.msg);
                            }
                            this.getTableData();
                        }).catch(err => {
                            console.log(err)
                        })
                    }
                })
            },
            //新增修改弹窗取消
            handleCancel(e) {
                this.addVisible = false
            },
            //表格搜索
            search(){
                this.getTableData();
            },
            //表格查询重置
            reset(){
                this.searchForm.resetFields();
                this.getTableData();
            }
        },
    }
</script>
<style scope>

</style>
