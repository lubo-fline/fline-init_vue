<template>
    <div>
        <a-spin :spinning="spinning">
            <a-row :gutter="16">
                <a-col :span="7">
                    <a-card :bordered="false">
                        <a-input-search placeholder="请输入" @search="search" v-model="searchName"/>
                        <a-tree @expand="onExpand" :expandedKeys="expandedKeys"  :autoExpandParent="autoExpandParent" @select="onSelect"  :selectedKeys="selectedKeys" :treeData="treeData">
                            <template slot="title" slot-scope="{ title }">
                                <span v-if="title.indexOf(searchName) > -1">
                                    {{ title.substr(0, title.indexOf(searchName)) }}
                                    <span style="color: #f50">{{ searchName }}</span>
                                    {{ title.substr(title.indexOf(searchName) + searchName.length) }}
                                </span>
                                <span v-else>{{ title }}</span>
                            </template>
                        </a-tree>
                    </a-card>
                </a-col>
                <a-col :span="15">
                    <a-card :bordered="false">
                        <div class='fontSize18 marginB10'>菜单信息
                            <div class='pull-right'>
                                <a-button type="primary" size="small" @click="add('menu')" :disabled="addBtnDisabled">新增</a-button>
                                <a-button type="primary" class='marginL15' size="small" @click="onDelete('menu')" :disabled="addBtnDisabled">删除</a-button>
                            </div>
                        </div>
                        <a-form layout="horizontal" :form="form" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                            <a-form-item label="id" v-show="false">
                                <a-input  placeholder="请输入" v-decorator="['id']"/>
                            </a-form-item>
                            <a-form-item label="版本号" v-show="false">
                                <a-input  placeholder="请输入" v-decorator="['version']"/>
                            </a-form-item>
                            <a-form-item label="类型" v-show="false">
                                <a-input  placeholder="请输入" v-decorator="['type',{initialValue:'MENU'}]"/>
                            </a-form-item>
                            <a-form-item label="所属菜单" v-show='false'>
                                <a-input placeholder="请输入" v-decorator="['parentId']"/>
                            </a-form-item>
                            <a-form-item label="名称">
                                <a-input placeholder="请输入" v-decorator="['name',
                                {rules: [{ required: true, message: '请输入名称' }]}]" :disabled="formDisabled"/>
                            </a-form-item>
                            <a-form-item label="路径">
                                <a-input placeholder="请输入" v-decorator="['location',
                                {rules: [{ required: true, message: '请输入路径' }]}]" :disabled="formDisabled"/>
                            </a-form-item>
                            <a-form-item label="编码">
                                <a-input placeholder="请输入" v-decorator="['code',
                                {rules: [{ required: true, message: '请输入编码' }]}]" :disabled="formDisabled"/>
                            </a-form-item>
                            <a-form-item label="图标">
                                <a-input placeholder="请输入" v-decorator="['icon',
                                {rules: [{ required: true, message: '请输入图标' }]}]" :disabled="formDisabled"/>
                            </a-form-item>
                            <a-form-item label="排序">
                                <a-input-number placeholder="请输入数字" style="width: 100%;" v-decorator="['ordinal']" :disabled="formDisabled"/>
                            </a-form-item>
                            <a-form-item label="备注">
                                <a-textarea placeholder="请输入" autoSize v-decorator="['memo']" :disabled="formDisabled"/>
                            </a-form-item>
                            <a-form-item class='text-right' :wrapper-col="{ span: 19 }" >
                                <a-button class="pull-right" type="primary" size="small" @click="save('menu')" :disabled="formDisabled">
                                    保存
                                </a-button>
                            </a-form-item>
                        </a-form>
                    </a-card>
                    <a-card class="marginT15">
                        <div class='fontSize18 marginB10'>按钮列表
                            <a-button class="pull-right" type="primary" size="small" @click="add('btn')" :disabled="addBtnDisabled">
                            新增按钮
                        </a-button>
                        </div>
                        <a-table :columns="columns" :dataSource="data" size="middle" :loading="loading" :pagination="false" :rowKey="record => record.id">
                            <template slot="index" slot-scope="text, record,index" class="marginT40">
                                <a-popconfirm >
                                    {{index}}
                                </a-popconfirm>
                            </template>
                            <template slot="operation" slot-scope="text, record">
                                <a-icon title='修改' type="edit" @click="edit(record)" class="marginR5"/>
                                <a-icon type="delete" title='删除' @click="onDelete('btn',record)"/>
                            </template>
                        </a-table>
                    </a-card>
                </a-col>
            </a-row>
            <a-modal :title="modalTitle" :visible="visible" @ok="save('btn')" :confirmLoading="confirmLoading" @cancel="handleCancel">
                <a-form layout="horizontal" :form="formModal"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                    <a-form-item label="id" v-show="false">
                        <a-input  placeholder="请输入" v-decorator="['id']"/>
                    </a-form-item>
                    <a-form-item label="版本号" v-show="false">
                        <a-input  placeholder="请输入" v-decorator="['version']"/>
                    </a-form-item>
                    <a-form-item label="类型" v-show="false">
                        <a-input  placeholder="请输入" v-decorator="['type',{initialValue:'BUTTON'}]"/>
                    </a-form-item>
                    <a-form-item label="所属菜单：" v-show="false">
                        <a-input placeholder="请输入" v-decorator="['parentId']"/>
                    </a-form-item>
                    <a-form-item label="名称：">
                        <a-input placeholder="请输入" v-decorator="['name', {rules: [{ required: true, message: '请输入名称' }]}]"/>
                    </a-form-item>
                    <a-form-item label="路径：">
                        <a-input placeholder="请输入" v-decorator="['location', {rules: [{ required: true, message: '请输入路径' }]}]"/>
                    </a-form-item>
                    <a-form-item label="编码：">
                        <a-input placeholder="请输入" v-decorator="['code', {rules: [{ required: true, message: '请输入编码' }]}]"/>
                    </a-form-item>
                    <a-form-item label="备注：">
                        <a-textarea placeholder="请输入" v-decorator="['memo']" autoSize/>
                    </a-form-item>
                </a-form>
            </a-modal>
        </a-spin>
    </div>
</template>
<script>
    const getParentKey = (key, tree) => {
        let parentKey
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i]
            if (node.children) {
                if (node.children.some(item => item.key === key)) {
                    const key = node.key
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
        if(data!=null){
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
    export default{
        data () {
            return {
                form: this.$form.createForm(this),
                formModal:this.$form.createForm(this,{name:'powerForm'}),
                autoExpandParent: true,
                formDisabled:true,
                expandedKeys: [],
                selectedKeys: [],
                treeData:[],
                data: [],
                loading:false,
                columns : [
                    {
                        title: '序号',
                        customRender: (value, row, index) => `${index+1}`
                    },{
                        title: '按钮名称',
                        dataIndex: 'name',
                    }, {
                        title: '路径',
                        dataIndex: 'location',
                    }, {
                        title: '编码',
                        dataIndex: 'code',
                    }, {
                        title: '备注',
                        dataIndex: 'memo',
                    }, {
                        title: '操作',
                        dataIndex: 'id',
                        key:'id',
                        scopedSlots: { customRender: 'operation' }
                    }
				],
                selectNodeData:{},
                visible:false,
                confirmLoading:false,
                modalTitle:'',
                okBtn:0,
                addBtnDisabled:true,
                searchName:'',
                nodeChild:[],
                spinning:false,
            }
        },
        created(){
            this.getTree();
        },
        methods: {
            //获取菜单树
            getTree() {
                this.spinning = true
                this.$axios.get('/permission/menu/tree').then((data) => {
                    this.spinning=false;
                    if (data.data.code == 200) {
                        this.treeData=data.data.data;
                        generateList(this.treeData)
                        for(var i=0;i<data.data.data.length;i++){
                            this.expandedKeys.push(data.data.data[i].key)
                        }
                    } else {
                        this.$message.error(data.data.msg);
                    };
                });
            },
            //树选择
            onSelect (selectedKeys, info) {
                this.formDisabled=true
                this.selectedKeys = selectedKeys
                this.getTableData();
                if(selectedKeys.length!=0){
					setTimeout(()=>{
						this.form.setFieldsValue({
							name:info.node.dataRef.model['name'],
							location:info.node.dataRef.model['location'],
							code:info.node.dataRef.model['code'],
							icon:info.node.dataRef.model['icon'],
							parentId:info.node.$parent.eventKey,
                            version:info.node.dataRef.model['version'],
                            id:info.node.dataRef.model['id'],
                            ordinal:info.node.dataRef.model['ordinal'],
						})
					},0)
                    this.addBtnDisabled=false
                    this.formDisabled=false;
                    this.nodeChild =info.node.dataRef.children;
                    this.selectNodeData=info.node.dataRef.model
                    this.okBtn=1;
                }else{
                    this.formDisabled=true;
                    this.addBtnDisabled=true;
                    this.nodeChild =[]
                    this.selectNodeData={};
                }
            },
            onExpand  (expandedKeys) {
                this.expandedKeys = expandedKeys
                this.autoExpandParent = false
            },
            search(){
                const value=this.searchName;
                const expandedKeys = dataList.map((item) => {
                    if (item.title.indexOf(value) > -1) {
                        return getParentKey(item.key, this.treeData)
                    }
                    return null
                }).filter((item, i, self) => item && self.indexOf(item) === i)
                Object.assign(this, {
                    expandedKeys,
                    searchValue: value,
                    autoExpandParent: true,
                })
                if(expandedKeys.length==0){
                    this.$message.warning('未查询到数据！');
                }
            },
            //获取菜单绑定按钮列表
            getTableData(){
                this.data =[]
                if(this.selectedKeys.length!=0) {
                    this.loading = true
                    this.$axios.get('/permission/button/list', {
                        params: {
                            menuId: this.selectedKeys[0]
                        }
                    }).then((data) => {
						this.loading = false;
						if (data.data.code == 200) {
							if (data.data.data != null) {
								this.data = data.data.data;
							}
						} else {
							this.$message.error(data.data.msg);
						};
					});
                }
            },
            add(type){
                this.okBtn=0;
                if(type=='menu'){
                    this.form.resetFields();
                    setTimeout(()=>{
						this.form.setFieldsValue({
							parentId:this.selectedKeys[0],
                            version:1,
                            id:0,
						})
					},0)
                }else{
                    this.formModal.resetFields();
                    this.visible=true;
                    this.modalTitle='新增按钮'
                    setTimeout(()=>{
						this.formModal.setFieldsValue({
							parentId:this.selectedKeys[0],
						})
					},0)
                }
            },
            edit(datas){
                this.okBtn=1;
                this.visible=true;
                this.formModal.resetFields();
                setTimeout(()=>{
                    this.formModal.setFieldsValue({
                        name:datas['name'],
                        location:datas['location'],
                        code:datas['code'],
                        icon:datas['icon'],
                        parentId:this.selectedKeys[0],
                        version:datas['version'],
                        id:datas['id'],
                    })
                },0)
                this.modalTitle='修改按钮'
            },
            save(type){
                if(this.okBtn!=0){
                    var url='/permission/update';
                    var title='修改'
                }else{
                    var url='/permission/create';
                    var title='新增'
                }
                if(type=='btn'){
                    this.formModal.validateFieldsAndScroll((err, values) => {
                        if (!err) {
                            this.saveActionn(url,title,type)
                        }
                    })
                }else{
                    this.form.validateFieldsAndScroll((err, values) => {
                        if (!err) {
                            this.saveActionn(url,title,type)
                        }
                    })
                }
            },
            saveActionn(url,title,type){
                var that=this;
                this.$confirm({
                    title: '是否要'+title+'?',
                    content: '',
                    okText: '确定',
                    okType: 'primary',
                    cancelText: '取消',
                    onOk() {
                        that.spinning=true;
                        that.confirmLoading=true;
                        if(type=='menu'){
                            var params=that.form.getFieldsValue();
                        }else{
                            var params=that.formModal.getFieldsValue();
                        }
                        that.$axios.post(url, that.$qs.stringify(params)).then(res => {
                            that.spinning=false;
                            that.confirmLoading=false;
                            if (res.data.code == 200) {
                                that.$message.success(res.data.msg);
                            } else {
                                that.$message.error(res.data.msg);
                            };
                            if(type=='btn'){
                                that.getTableData()
                                that.visible=false
                            }else{
                                that.getTree();
                                if(title=='修改'){
                                    that.getTableData()
                                }else{
                                    that.formDisabled=true;
                                    that.addBtnDisabled=true;
                                    that.selectedKeys=[];
                                    that.form.resetFields();
                                }
                            }
                        }).catch(err => {
                            console.log(err)
                        })
                    },
                    onCancel() {
                    },
                });
            },
            onDelete(type,datas){
                if(type=='menu'){
                    if(this.nodeChild!=null && this.nodeChild.length!=0){
                        this.$message.error('该节点还有子节点，请先删除子节点！');
                        return
                    }
                    if(this.selectedKeys==''){
                        this.$message.error('请选择要删除的菜单！');
                    }
                    var title='菜单'
                }else{
                    var title='按钮'
                }   
                var that=this;
                this.$confirm({
                    title: `是否要删除该${title}?`,
                    content: '',
                    okText: '确定',
                    okType: 'primary',
                    cancelText: '取消',
                    onOk() {
                        that.spinning=true;
                        that.$axios.delete('/permission/remove',{params:{
                            "id":datas?datas.id:that.selectedKeys[0],
                            version:datas?datas.version:that.selectNodeData.version
                        }}).then(res=>{
                            that.spinning=false;
                            if (res.data.code == 200) {
                                that.$message.success(res.data.msg);
                            }else {
                                that.$message.error(res.data.msg);
                            };
                            that.getTree();
                            that.formDisabled=true;
                            that.getTableData()
                        }).catch (err=>{
                            console.log(err)
                        })
                    },
                    onCancel() {
                    },
                });
            },
            handleCancel(){
                this.visible=false;
            }
        },
    }
</script>
<style>

</style>
