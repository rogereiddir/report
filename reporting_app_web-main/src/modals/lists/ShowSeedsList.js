import React ,{ useState , useEffect , useRef } from 'react'
import { Modal , message ,Table , Button , Popconfirm , Badge , Input , Space } from 'antd';
import { DeleteOutlined , SearchOutlined } from '@ant-design/icons'
import { useSelector , useDispatch } from "react-redux";
import { isEmpty } from 'underscore'
import { DeleteSeed , fetchListSeeds } from "../../store/actions/seeds";
import moment from 'moment';
import Highlighter from 'react-highlight-words';



 const ShowListDetails = (props) => {

  const [selectedRowKeys , setSelected] = useState([])
  const [disabled , setDisabled] = useState(true)
  const [search , setSearchText] = useState('')
  const [column , setColumn] = useState('')
  const [loading , setLoading] = useState(true)
  const [loadingb , setLoadingb] = useState(false)
  const userId = useSelector(state => state.userAuth.user.userId)
  const seeds = useSelector(state => state.seeds)
  const dispatch = useDispatch()
  const {list} = props

  const isMounted = useRef(true);
  const onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelected(selectedRowKeys)
    setDisabled(false)
    if(isEmpty(selectedRowKeys)){
      setDisabled(true)
    }
  }
  let inputSearch = null
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
      return (
        <div style={{ padding: 8 }}>
          <Input
            ref={node => {
              inputSearch = node;
            }}
            placeholder={`Search`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              shape="round"
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}>
              Search
            </Button>
            <Button shape="round" onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
              cancel
            </Button>
          </Space>
        </div>
      )
    },
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() =>inputSearch.select(), 100);
      }
    },
    render: text =>
      column === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[search]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0])
    setColumn(dataIndex)
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('')
  };

  
  useEffect(()=> {
    isMounted.current = true;
    if (isMounted.current) {
      if(Object.keys(list).length !== 0){
        
        async function fetchMyAPI() {
          await dispatch(fetchListSeeds({list:list.id}))
          setLoading(false)
        }
    
        fetchMyAPI()
      }
    }
    return ()=>{
      isMounted.current = false;
    }
  },[list,userId,dispatch])

  const handleCancel = () => {
    console.log('Clicked cancel button');
    props.toggleModal("showvisible")
  }

  const confirm = (e) => {
    setLoadingb(true)
    dispatch(DeleteSeed({ids:e,listId:list.id}))
    .then(()=>{
      setLoadingb(false)
      setLoading(true)
      dispatch(fetchListSeeds({list:list.id}))
      setLoading(false)
      message.success('Seeds Deleted');
      setDisabled(true)
      setSelected([])
    }).catch(()=>{
      setDisabled(true)
      setLoading(false)
      message.error('Error while Deleting!!');
    });
  }
  const cancel = (e) => {
      message.error('Canceled');
      setDisabled(true)
      setSelected([])
  }

  let { showvisible } = props;
  const columns = [
    { title: 'Email', dataIndex: 'email', key: 'email' , ...getColumnSearchProps('email') },
    { title: 'Password', dataIndex: 'password', key: 'password' },
    { title: 'Proxy', dataIndex: 'proxy', key: 'proxy' },
    { title: 'Isp', dataIndex: 'isp', key: 'isp' },
    { title: 'Created', dataIndex: 'createdAt', key: 'createdAt'  , render: (createdAt) => moment(createdAt).format('DD-MM-YYYY hh:mm:ss') },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    hideDefaultSelections: true,
    selections: [{
      key: 'all-data',
      text: 'Select All Data',
      onSelect: () => {
        setSelected([...Array(46).keys()])
      },
    }],
  };

    return (
      <Modal
        width={"90%"}
        title={list.name}
        visible={showvisible}
        onCancel={handleCancel}
        footer={false}>
          <Popconfirm title="Are you sure?" onConfirm={ (e) => confirm(selectedRowKeys)} onCancel={cancel} okText="Yes" cancelText="No">
            <Badge count={selectedRowKeys.length}>
              <Button size="large" shape="round" icon={<DeleteOutlined/>} disabled={disabled} type="danger" loading={loadingb}>
                DELETE                      
              </Button>
            </Badge>
          </Popconfirm>
          <Table
            style={{marginTop:"1.5rem"}}
            rowKey={record => record.id}
            columns={columns}
            dataSource={seeds}
            rowSelection={rowSelection}
            pagination={{ pageSize: 10 }}
            loading={loading}
          />
      </Modal>
    )
}

export default ShowListDetails