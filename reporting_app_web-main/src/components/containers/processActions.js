import React from 'react'
import { Button , Divider } from 'antd';
import { EditTwoTone , PlayCircleTwoTone , PauseCircleTwoTone , StopTwoTone , ExceptionOutlined , StepForwardOutlined } from '@ant-design/icons'

export default function ProcessActions({ 
  id, 
  loadingStart, 
  loadingStop, 
  loadingResume, 
  loadingPause, 
  pauseProcess, 
  startProcess, 
  resumeProcess, 
  stopProcess, 
  editProcess, 
  showLogs
}) 
{
    return (
        <span>
          <Button size="large" shape="circle" title="lunch" icon={<PlayCircleTwoTone twoToneColor="#52c41a" />} loading={loadingStart.includes(id)} onClick={() => startProcess(id)} />
          <Divider type="vertical" />
          <Button size="large" shape="circle" title="pause"  icon={<PauseCircleTwoTone />} loading={loadingPause.includes(id)} onClick={() =>  pauseProcess(id)} />
          <Divider type="vertical" />
          <Button size="large" shape="circle" icon={<StepForwardOutlined />} loading={loadingResume.includes(id)} onClick={() =>  resumeProcess(id)} title="resume" />
          <Divider type="vertical" />
          <Button size="large" shape="circle" icon={<StopTwoTone twoToneColor="#d4380d" />} loading={loadingStop.includes(id)} onClick={() => stopProcess(id)} />
          <Divider type="vertical" />
          <Button size="large" shape="circle" icon={<EditTwoTone twoToneColor="#531dab" />}  onClick={()=> editProcess(id)} />
          <Divider type="vertical" />
          <Button size="large" shape="circle" title="Logs" icon={<ExceptionOutlined color="#531dab" />} onClick={()=> showLogs(id)} />
        </span>
    )
}
