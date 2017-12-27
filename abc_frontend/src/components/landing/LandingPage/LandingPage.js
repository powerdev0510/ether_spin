import React from 'react';
import styles from './LandingPage.scss';
import classNames from 'classnames/bind';

import { PageTemplate, GameCard } from 'components';
import { HeaderContainer, ChatBox } from 'containers';

import img1 from 'static/assets/game1.png';
import img2 from 'static/assets/game2.png';
import img3 from 'static/assets/game3.png';

const cx = classNames.bind(styles);

const LandingPage = () => {
  return (
    <PageTemplate header={<HeaderContainer/>}  padding={'3.5rem'} responsive>
      <div className={cx('landing-page')}>
        <div className='gametype'>
          <GameCard imgData={img2} header="1 / 1" small="Roll the dice" key={1}/>
          <GameCard imgData={img2} header="1 / 10" small="Roll the dice" key={2}/>
          <GameCard imgData={img2} header="1 / 100" small="Roll the dice" key={3}/>
          <GameCard imgData={img2} header="1 / 1000" small="Roll the dice" key={4}/>
          <GameCard imgData={img2} header="1 / 10000" small="Roll the dice" key={5}/>
        </div>
        <ChatBox />
      </div>
    </PageTemplate>
  );
  // return (
  //   <div>asdf</div>
  // );
};

export default LandingPage;