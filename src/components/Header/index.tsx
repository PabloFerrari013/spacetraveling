import Image from 'next/image';
import React from 'react';

import styles from './header.module.scss';
import commonStyles from '../../styles/common.module.scss';

import Logo from '../../../public/Logo.svg';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className={` ${commonStyles.layout} ${styles.container}`}>
      <Link className={styles.img} href="/">
        <Image layout="responsive" src={Logo} alt="logo" />
      </Link>
    </header>
  );
};

export default Header;
