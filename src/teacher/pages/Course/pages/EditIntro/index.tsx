import React, { FunctionComponent } from 'react'
import "./index.scss" 
import Panel from '@/common/components/Panel'; 
import RichEditor from '@/common/components/RichEditor';
import { observer } from 'mobx-react-lite';

interface Props{
  params: {
    id: string;
  };
  
}

const EditIntro:FunctionComponent<Props> = ({})=>{


  return <Panel style={{flex:1}} >
    <RichEditor
    
    />
  </Panel>
};

export default observer(EditIntro); 