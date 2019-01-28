import React, { FunctionComponent } from 'react'
import "./index.scss" 
import Panel from '@/common/components/Panel';
import { connect } from 'react-redux';
import RichEditor from '@/common/components/RichEditor';

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

export default connect()(EditIntro); 