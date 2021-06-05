import React, {useState} from 'react';
import Sketch from './../sketch/index';
import { Button, Layout, Modal, Divider } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { HOME_PAGE_URL } from './../sketch/constants';
import '../../background.scss';
import EmptyPage from './home';
import { getURLParam } from './../sketch/utils';

const Home = () => {

    const { Content } = Layout;
    const [showNav, setShowNav] = useState(false);
    const [activateRoom, setactivateRoom] = useState(getURLParam('k'));

    const toggleNav = () => {
        setShowNav(p => !p);
    }
    
    console.log('Home page');

    return (
        <>
            <div class="area" >
                <ul class="circles">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                </ul>
            </div >

            <Layout className='gradientBg fullHeight'>
                <Content className='fullHeight' style={{ padding: '8px', height: '100%' }}>
                    <div style={{ background: 'none', height: '50px', paddingLeft: '50px' }}>
                        <Button onClick={toggleNav}>
                            <MenuOutlined />
                        </Button>
                    </div>
                    { 
                        activateRoom?
                            (<Sketch className='sketch' />)
                            :(<EmptyPage setactivateRoom={setactivateRoom}/>)
                    }
                    <Modal className='blob' title={null} visible={showNav} onCancel={toggleNav} destroyOnClose={true} footer={
                        <span style={{ fontSize: '15px' }}>This app is built by <a href="https://github.com/Rajesh-Khanna">@Rajesh</a> and <a href="https://github.com/theVirtualMan">@Rohit</a></span>
                    }>
                        <h3 style={{ float: 'right' }}>
                            <a className='navElement' href={HOME_PAGE_URL}> Home</a>
                            <a className='navElement' href={HOME_PAGE_URL}> other game</a>
                        </h3>
                        <Divider />
                        <p>
                            <h3> Something </h3>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. At itaque, harum aperiam numquam nam vitae ratione nesciunt quibusdam error, quis ipsa fugit possimus praesentium natus quae dicta officia? Esse, excepturi!
                            <br />
                        </p>
                    </Modal>
                </Content>
            </Layout>
        </>
    );
}

export default Home;