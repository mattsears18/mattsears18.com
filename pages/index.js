import Head from 'next/head';
import Image from 'next/image';
import resumeIcon from '../public/images/resumeIcon80.png';
import linkedInIcon from '../public/images/linkedInIcon80.png';
import githubIcon from '../public/images/githubIcon80.png';
import researchGateIcon from '../public/images/researchGateIcon80.png';
import profilePic from '../public/images/profile.png';
import styles from '../styles/Home.module.css';
import utilStyles from '../styles/utils.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Matt Sears, PhD</title>
        <meta name="description" content="Personal site for Matt Sears, PhD" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.homeHeaderImage}>
          <Image
            src={profilePic}
            className={utilStyles.borderCircle}
            alt="Picture of Matt Sears"
          ></Image>
        </div>
        <h1 className={styles.title}>Matt Sears</h1>
        <p className={styles.description}>
          <code>Personal portfolio coming soon...</code>
        </p>
        <p
        // className={styles.linkedInIcon}
        >
          <a href="/Matt Sears - Resume 2021-06-20.pdf" target="_blank">
            <Image src={resumeIcon} alt="Download Resume" />
          </a>
          &nbsp;&nbsp;
          <a
            href="https://github.com/mattsears18/"
            target="_blank"
            rel="noreferrer"
          >
            <Image src={githubIcon} alt="Github Profile" />
          </a>
        </p>
        <p>
          <a
            href="https://www.researchgate.net/profile/Matt-Sears/research"
            target="_blank"
            rel="noreferrer"
          >
            <Image src={researchGateIcon} alt="ResearchGate Profile" />
          </a>
          &nbsp; &nbsp;
          <a
            href="https://linkedin.com/in/mattsears18/"
            target="_blank"
            rel="noreferrer"
          >
            <Image src={linkedInIcon} alt="LinkedIn Profile" />
          </a>
        </p>
      </main>
    </div>
  );
}
