import React, { useEffect, useRef } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledAboutSection = styled.section`
  max-width: 900px;

  .inner {
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-gap: 50px;

    @media (max-width: 768px) {
      display: block;
    }
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 30px;
    margin-bottom: 30px;
  }
`;
const StyledText = styled.div`
  ul.skills-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(140px, 200px));
    grid-gap: 0 10px;
    padding: 0;
    margin: 20px 0 0 0;
    overflow: hidden;
    list-style: none;

    li {
      position: relative;
      margin-bottom: 10px;
      padding-left: 20px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);

      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--green);
        font-size: var(--fz-sm);
        line-height: 12px;
      }
    }
  }
`;
const StyledPic = styled.div`
  position: relative;
  max-width: 300px;

  @media (max-width: 768px) {
    margin: 50px auto 0;
    width: 70%;
  }

  .wrapper {
    ${({ theme }) => theme.mixins.boxShadow};
    display: block;
    position: relative;
    width: 100%;
    border-radius: var(--border-radius);
    background-color: var(--green);

    &:hover,
    &:focus {
      background: transparent;
      outline: 0;

      &:after {
        top: 15px;
        left: 15px;
      }

      .img {
        filter: none;
        mix-blend-mode: normal;
      }
    }

    .img {
      position: relative;
      border-radius: var(--border-radius);
      mix-blend-mode: multiply;
      filter: grayscale(100%) contrast(1);
      transition: var(--transition);
    }

    &:before,
    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius);
      transition: var(--transition);
    }

    &:before {
      top: 0;
      left: 0;
      background-color: var(--navy);
      mix-blend-mode: screen;
    }

    &:after {
      border: 2px solid var(--green);
      top: 20px;
      left: 20px;
      z-index: -1;
    }
  }
`;

const About = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const skills = [
    'JavaScript (ES 2021+)',
    'TypeScript ❤️',
    'React',
    'Node.js',
    'GraphQL',
    'Jest',
    'Terraform',
    'Docker',
    'AWS Lambda',
    'AWS ECS',
    'Hasura ❤️',
    'Next.js ❤️',
    'Remix',
    'Redwood.js',
  ];

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">About me</h2>

      <div className="inner">
        <StyledText>
          <div>
            <p>
              Hello! My name is Matt and I enjoy creating efficient, automated things. Back in 2011,
              I was a construction project manager searching for an affordable document transmittal
              system (think Dropbox on steroids, but before file sharing services became popular).
              The existing solutions were incredibly expensive at the time, but they seemed so
              simple. How hard could it possibly be to just build one myself?! I had to find out. I
              didn't know the first thing about software development back then, and I vividly
              remember googling{' '}
              <i>
                {`"`}
                how do I save something to the internet.
                {`"`}
              </i>{' '}
              <span role="img" aria-label="Grinning Squinting Face Emoji">
                😆
              </span>
            </p>

            <p>
              Learning new things - in depth - is <strong>by far</strong> my greatest strength.{' '}
              <span role="img" aria-label="Flexed Biceps Emoji">
                💪
              </span>
            </p>

            <p>
              I built that document transmittal system and I absolutely fell in love with software
              development in the process. The app became my pet project for a few years and I
              expanded it into a full-blown social network and project management platform for
              construction professionals. For several years, I worked two full-time jobs. I worked
              my {`"`}real{`"`} job that paid the bills, and then I spent every single night and
              weekend at <a href="https://g.co/kgs/sepgCy">my favorite coffee shop</a>, teaching
              myslef how to build software.
            </p>

            <p>
              In 2016, I started my PhD in Civil Engineering, studying construction productivity. I
              learned a ton about statistics and data science during grad school, but I also
              convinced my advisor to allow me to spend the vast majority of my time building
              software to support our research. Software engineering was still a full-time job for
              me then. When I started my PhD, I thought that I wanted to be a professor. I was
              excited about studying construction productivity and teaching the concepts to
              students. However, by the time I finished my PhD, I realized that I was actually much
              more interested in software engineering, so I finally dove all-in on software. That
              was one of the best decisions that I've ever made.
            </p>

            <p>
              <a
                className="email-link"
                href="https://www.researchgate.net/profile/Matt-Sears"
                target="_blank"
                rel="noreferrer">
                Check out my research!
              </a>
            </p>

            <p>
              Here are a few technologies that I've been working with lately (see{' '}
              <a href="/MattSears_Resume_2023-02-19.pdf">my resume</a> for a more complete list of
              skills and expertise) :
            </p>
          </div>

          <ul className="skills-list">
            {skills && skills.map((skill, i) => <li key={i}>{skill}</li>)}
          </ul>
        </StyledText>

        <StyledPic>
          <div className="wrapper">
            <StaticImage
              className="img"
              src="../../images/me.jpg"
              width={500}
              quality={95}
              formats={['AUTO', 'WEBP', 'AVIF']}
              alt="Headshot"
            />
          </div>
        </StyledPic>
      </div>
    </StyledAboutSection>
  );
};

export default About;
