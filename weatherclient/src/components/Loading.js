import React from 'react';
import { css } from 'react-emotion';
import ClipLoader from 'react-spinners/ClipLoader';
const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

const Loading = (props)=> (
    <div className='sweet-loading'>
        <ClipLoader
            className={override}
            sizeUnit={"px"}
            size={150}
            color={'#123abc'}
            loading={props.loading}
        />
    </div>
    )
export default Loading;