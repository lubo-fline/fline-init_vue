<template>
    <div>
        <a-card :bordered="false">
            <a-form layout="inline" :form="searchForm">
                <div class='text-right'>
                    <a-form-item>
                        <a-button type="primary" @click="getUserRole">分配角色</a-button>
                    </a-form-item>              
                    <a-form-item>
                        <a-button type="primary" @click="add">新增</a-button>
                    </a-form-item>                     
                    <a-form-item>
                        <a-button type="primary" @click="search">查询</a-button>
                    </a-form-item>
                    <a-form-item>
                        <a-button type="default" @click="reset">清空</a-button>
                    </a-form-item>
                </div>
                <a-form-item label="用户名：">
                    <a-input placeholder="请输入" v-decorator="['username']"/>
                </a-form-item>
                <a-form-item label="姓名：">
                    <a-input placeholder="请输入" v-decorator="['name']"/>
                </a-form-item> 
            </a-form>
        </a-card>
        <a-card :bordered="false" class='marginT20'>
            <a-table :columns="columns" :dataSource="tableData" :pagination="false" :rowKey="record => record.id" :loading="loading" size="middle" :rowSelection="rowSelection">
                <template slot="sex" slot-scope="text">
                    <span>{{ text==0?'女':'男' }}</span>
                </template>
                <template slot="operation" slot-scope="text, record">
                    <a-icon type="edit" @click="edit(record)" class="marginR5" title='修改'/>
                    <a-popconfirm title="是否删除?" @confirm="() => onDelete(record)" okText="是" cancelText="否">
                        <a-icon type="delete"/>
                    </a-popconfirm>
                </template>
            </a-table>
            <a-pagination class='marginT10 pull-right' v-model="current" :total="total" size="small"/>
        </a-card>
        <a-modal :title="modalTitle" :visible="addVisible" @ok="handleOk" :confirmLoading="confirmLoading" @cancel="handleCancel">
            <a-form layout="horizontal" :form="form">
                <a-form-item label="id" v-show="false">
                    <a-input  placeholder="请输入" v-decorator="['id']" />
                </a-form-item>
                <a-form-item label="版本号" v-show="false">
                    <a-input  placeholder="请输入" v-decorator="['version']"/>
                </a-form-item>
                <a-form-item label="用户名" :label-col="{ span:7 }" :wrapper-col="{ span: 12 }">
                    <a-input  placeholder="请输入" :disabled='okBtn==1' v-decorator="['username',{rules: [{ required: true, message: '请输入' },{validator: usernameValidate}]}]"/>
                </a-form-item>
                <a-form-item label="姓名" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }" >
                    <a-input placeholder="请输入" v-decorator="['name',{rules: [{ required: true, message: '请输入' }]}]"/>
                </a-form-item>
                <a-form-item label="性别：" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }" >
                    <a-radio-group v-decorator="['sex',{initialValue:1,rules: [{ required: true, message: '请输入' }]}]">
                        <a-radio :value="1">男</a-radio>
                        <a-radio :value="0">女</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="部门" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                    <a-tree-select multiple :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }" :treeData="departmentData" placeholder="请选择" treeDefaultExpandAll v-decorator="['deptIds',{rules: [{ required: true, message: '请输入' }]}]">
					</a-tree-select>
                </a-form-item>
                <a-form-item label="移动电话：" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }" >
                    <a-input placeholder="请输入" v-decorator="['mobilePhone',{rules: [{ required: true, message: '请输入' }]}]"/>
                </a-form-item>
            </a-form>
        </a-modal>
        <a-modal title="角色分配" :visible="roleVisible" @ok="handleOkRole"  :confirmLoading="confirmLoading" @cancel="handleCancelRole">
            <a-form layout="horizontal" :form="roleForm">
                <a-form-item>
                    <a-transfer :dataSource="rolesData" :titles="['未分配权限', '已分配权限']" :targetKeys="targetKeys" @change="handleChange" :render="item=>item.name"/>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                form: this.$form.createForm(this),//新增用户
                searchForm: this.$form.createForm(this),//表格搜索
                roleForm:this.$form.createForm(this),//角色分配表单
                pageSize:10,
                tableData: [],//表格数据
                current:1,
                loading:false,
                columns : [
                    {
                        title: '用户名',
                        dataIndex: 'username',
                        key:'username'
                    }, {
                        title: '姓名',
                        dataIndex: 'name',
                    },{
                        title: '性别',
                        dataIndex: 'sex',
                        key:'sex',
                        scopedSlots: { customRender: 'sex' }
                    },{
                        title: '移动电话',
                        dataIndex: 'mobilePhone',
                    }, {
                        title: '操作',
                        dataIndex: 'id',
                        key:'id',
                        scopedSlots: { customRender: 'operation' }
                    }],
                total:0,
                addVisible:false,//新增弹窗是否可见
                confirmLoading:false,
                roleVisible:false,//角色分配是否可见
                okBtn:0,
                modalTitle:'',
                rolesData:[],//所有角色数据
                tableSelectData:{},//表格选中数据
                targetKeys:[],
                departmentData:[],//部门下拉树数据
            }
        },
        watch:{
            current(val) {
                this.getTableData()
            },
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
        created(){
            this.getTableData();
            this.getTree();
        },
        methods:{
            //获取用户表格
            getTableData(){
                this.loading = true
                var params=this.searchForm.getFieldsValue();
                params['pageSize']=this.pageSize;
                params['pageNum']=this.current
                this.$axios.get('/user/page',{params:params}).then((data) => {
                    this.loading = false;
                    if (data.data.code === 200) {
                        this.total = data.data.data?data.data.data.count:0;
                        this.tableData = data.data.data?data.data.data.items:[];
                    }
                });
            },
            //用户新增
            add(){
                this.modalTitle='用户新增'
                this.addVisible = true;
                this.okBtn=0;
                this.form.resetFields();
            },
            //校验用户名唯一
            usernameValidate (rule, value, callback) {
                if(this.okBtn!==1){
                    this.$get(`/user/username/exists/${value}`).then(data=>{
                        if (data.code === 200) {
                            if (value && data.data) {
                                callback('该用户名已存在');
                            } else {
                                callback();
                            }
                        }
                    }).catch (err=>{
                        console.log(err)
                    })
                }else{
                    callback();
                }
            },
            //修改用户名
            edit(datas) {
                this.modalTitle='用户修改'
                this.okBtn=1;
                this.addVisible = true;
                this.form.resetFields();
                setTimeout(() => {
                    this.form.setFieldsValue({
                        id:datas.id,
                        username:datas.username,
                        name:datas.name,
                        sex:datas.sex,
                        mobilePhone:datas.mobilePhone,
                        version:datas.version
                    })
                }, 0)
            },
            //删除用户名
            onDelete (datas) {
                this.$axios.delete('/user/remove',{params:{"id":datas.id,version:datas.version}}).then(data=>{
                    if (data.data.code === 200) {
                        this.$message.success(data.data.msg);
                        this.getTableData();
                    }
                }).catch (err=>{
                    console.log(err)
                })
            },
            //新增、修改用户名确认
            handleOk(e) {
                if(this.okBtn==0){
                    var url='/user/create';
                }else{
                    var url='/user/update';
                }
                e.preventDefault();
                this.form.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                        this.confirmLoading = true;
                        var params=this.form.getFieldsValue();
                        this.$axios.post(url,this.$qs.stringify(params,{ indices: false })).then(data=>{
                            this.addVisible = false;
                            this.confirmLoading = false;
                            if (data.data.code === 200) {
                                this.$message.success(data.data.msg);
                            }
                            this.getTableData();
                        }).catch (err=>{
                            console.log(err)
                        })
                    }
                });
            },
            //新增、修改用户名取消
            handleCancel(e) {
                this.addVisible = false
            },
            //搜索表格
            search(){
                this.getTableData();
            },
            //重置表格搜索条件
            reset(){
                this.searchForm.resetFields();
                this.getTableData();
            },
            //角色分配获取数据打开弹窗
            getUserRole(){
                if(JSON.stringify(this.tableSelectData)!=='{}'){
                    this.roleVisible = true
                    this.targetKeys=[];
                    //表格刷新后去掉选中项，无法更新选中项的数据，特此处理
                    var roleIds=this.tableData.find(item=>item.id==this.tableSelectData.id).roleIds
                    if(roleIds.length>0){
                        roleIds.forEach(item=>{
                            this.targetKeys.push(item.toString())
                        })
                    }
                    this.rolesData=[];
                    this.$get('/role/all').then((data) => {
                        if(data.code==200){
                            if(data.data.length>0){
                                data.data.forEach(item=>{
                                    item['key']=item.id.toString();
                                    item['title']=item.name
                                    this.rolesData.push(item)
                                })
                            }
                        }
                    });
                }else{
                    this.$message.warning('请选择要分配的用户！');
                }
            },
            //角色分配确认
            handleOkRole(e) {
                e.preventDefault();
                this.roleForm.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                        this.confirmLoading = true;
                        this.$axios.post('/user/assignRoles', this.$qs.stringify({
                            "userId": this.tableSelectData.id,
                            "roleIds": this.targetKeys,
                        }, { indices: false })).then(data => {
                            this.roleVisible = false;
                            this.confirmLoading = false;
                            if (data.data.code === 200) {
                                this.$message.success(data.data.msg);
                                this.getTableData();
                            }
                        }).catch(err => {
                            console.log(err)
                        })
                    }
                })
            },
            //角色分配取消
            handleCancelRole(e) {
                this.roleVisible = false
            },
            //角色分配选择切换
            handleChange(nextTargetKeys, direction, moveKeys) {
                this.targetKeys=nextTargetKeys
            },
            //获取部门树
            getTree() {
                this.loading = true
                this.$get('/department/tree').then((data) => {
                    if (data.code === 200) {
                        this.departmentData=data.data || []
                    }
                });
            },
        },
    }
</script>
<style scope>

</style>
