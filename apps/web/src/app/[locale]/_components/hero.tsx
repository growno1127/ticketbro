import { Sparkles, Github, Mail, Sparkle, Twitter } from '@repo/ui/icons';
import Link from 'next/link';
import { Balancer } from 'react-wrap-balancer';
import { Button } from '@repo/ui/components/button';
import { HeroIllustration, BackgroundGrid } from './hero-illustration';
import { getScopedI18n } from '~/locales/server';

function TypeHeroLogo3D() {
  return (
    <svg
      className="h-28 w-28 sm:h-44 sm:w-44"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 638 638"
      fill="none"
    >
      <g className="hidden dark:block" filter="url(#filter0_ii_284_103)">
        <rect width="637.029" height="637.029" rx="68.1096" fill="#3178C6" />
      </g>
      <g className="block dark:hidden">
        <rect width="637.029" height="637.029" rx="68.1096" fill="#3178C6" />
      </g>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M243.77 314.169H318.615V288.585V263H110V314.169H184.479V542H243.77V314.169Z"
        fill="white"
      />
      <path
        d="M353.385 542V263H413.381V378.626H501.858V263H562V542H501.858V425.967H413.381V542H353.385Z"
        fill="white"
      />
      <defs>
        <filter
          id="filter0_ii_284_103"
          x="-49"
          y="-49"
          width="736.029"
          height="736.029"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="-49" dy="-49" />
          <feGaussianBlur stdDeviation="74.5" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_284_103" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="50" dy="50" />
          <feGaussianBlur stdDeviation="57.5" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.12 0" />
          <feBlend
            mode="normal"
            in2="effect1_innerShadow_284_103"
            result="effect2_innerShadow_284_103"
          />
        </filter>
      </defs>
    </svg>
  );
}
function BeamOfLight() {
  return (
    <svg
      className="pointer-events-none absolute left-0 top-0 z-[-1] h-[69%] w-full sm:w-[69%] lg:w-[42%]"
      viewBox="0 0 2378 1682"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_791_106)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 2222.88 1131.09)"
          fill="white"
          fillOpacity="0.21"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_791_106"
          x="-1408.14"
          y="-1159.16"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur_791_106" />
        </filter>
      </defs>
    </svg>
  );
}

export async function Hero() {
  const t = await getScopedI18n('landing.hero');

  return (
    <section className="-mt-[56px] min-h-[calc(100vh)] overflow-hidden lg:min-h-0 lg:pt-[56px]">
      <div className="absolute inset-10 -z-30 overflow-hidden rounded-full opacity-70 lg:hidden">
        <BackgroundGrid />
      </div>
      <BeamOfLight />
      <div className="container grid min-h-screen items-center justify-center lg:min-h-0 lg:grid-cols-2">
        <div className="flex w-full flex-col items-center justify-center gap-10 lg:items-start">
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/typehero/typehero"
            className="group rounded-full bg-gradient-to-r from-yellow-600 via-black to-[#3178c6] to-70% bg-[length:420%_420%] bg-center p-[1px] brightness-90 contrast-150 duration-500 hover:bg-left-top hover:shadow-[0_0_2rem_-0.75rem_#eab308] dark:from-yellow-500 dark:via-white dark:to-[#3178c6] dark:brightness-125 dark:contrast-100"
          >
            <div className="rounded-full bg-white/80 px-3 py-1 dark:bg-black/80">
              <span className="dark:to-via-white relative flex items-center bg-gradient-to-r from-yellow-600 via-black to-[#3178c6] to-70% bg-[length:420%_420%] bg-clip-text bg-center text-transparent duration-500 group-hover:bg-left-top dark:from-yellow-500 dark:via-white dark:to-[#3178c6]">
                <Sparkles className="absolute -left-1 top-0.5 h-5 w-5 translate-x-0.5 scale-50 stroke-yellow-500 opacity-0 duration-500 dark:group-hover:rotate-[125deg] dark:group-hover:scale-100 dark:group-hover:opacity-100" />
                <Sparkle className="mr-2 h-4 w-4 stroke-black stroke-2 duration-500 group-hover:rotate-180 group-hover:scale-110 group-hover:stroke-yellow-600 dark:stroke-white dark:duration-500 dark:group-hover:scale-[2] dark:group-hover:opacity-0" />{' '}
                Star us on Github
              </span>
            </div>
          </a>
          <div className="relative flex w-full items-center justify-center gap-4 lg:justify-start">
            <div className="absolute left-1/2 top-1/2 -z-10 hidden h-56 w-56 -translate-x-[15%] -translate-y-[50%] rounded-full bg-slate-400/10 blur-3xl dark:block" />
            <div className="absolute right-1/2 top-1/2 -z-10 hidden h-56 w-56 -translate-y-[40%] rounded-full bg-[#3178c6]/20 blur-3xl dark:block" />
            <TypeHeroLogo3D />
            <h1 className="bg-gradient-to-br from-[#3178c6] from-[69%] to-black/0 bg-clip-text text-6xl font-extrabold text-transparent dark:from-white dark:from-0% dark:to-[#3178c6] sm:text-8xl sm:leading-[5.5rem]">
              type
              <br />
              hero
            </h1>
          </div>

          <p className="max-w-[55ch] bg-transparent text-center font-medium leading-8 text-black/60 dark:text-white/50 sm:px-8 lg:px-0 lg:text-left">
            <Balancer>{t('description')}</Balancer>
          </p>
          <div className="flex flex-col-reverse gap-3 md:flex-row">
            <Button
              asChild
              className="hero-join-button group relative mx-auto w-fit overflow-hidden rounded-xl p-[2px] font-bold transition-all duration-300 hover:bg-transparent hover:shadow-[0_0_2rem_-0.5rem_#3178c6] dark:hidden md:mr-0 lg:mr-auto"
            >
              <Link href="/waitlist">
                <span className="inline-flex h-full w-fit items-center gap-1 rounded-[10px] bg-white px-4 py-2 text-[#3178c6] transition-all duration-300">
                  <Mail className="mr-1 h-4 w-4 stroke-[3]" />
                  {t('buttons.waitlist')}
                </span>
              </Link>
            </Button>
            <Button
              asChild
              className="hero-join-button-dark group relative mx-auto hidden w-fit overflow-hidden rounded-xl p-[1px] font-bold transition-all duration-300 dark:block dark:hover:shadow-[0_0_2rem_-0.5rem_#fff8] md:mr-0 lg:mr-auto"
            >
              <Link href="/waitlist">
                <span className="inline-flex h-full w-fit items-center gap-1 rounded-xl px-4 py-2 transition-all duration-300 dark:bg-neutral-900 dark:text-white group-hover:dark:bg-black">
                  <Mail className="mr-1 h-4 w-4 stroke-[3]" />
                  {t('buttons.waitlist')}
                </span>
              </Link>
            </Button>
            <div className="flex gap-3">
              <Button
                asChild
                className="flex items-center gap-2 rounded-xl border-2 px-4 py-2 dark:text-white"
                variant="outline"
              >
                <a
                  target="_blank"
                  rel="noreferrer"
                  className="gap-1 md:inline-flex"
                  href="https://github.com/typehero/typehero"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </Button>
              <Button
                asChild
                className="flex items-center gap-2 rounded-xl border-2 px-4 py-2 dark:text-white"
                variant="outline"
              >
                <a
                  target="_blank"
                  rel="noreferrer"
                  className="gap-1 md:inline-flex"
                  href="https://twitter.com/typeheroapp"
                >
                  <Twitter className="h-4 w-4" />
                  Twitter
                </a>
              </Button>
            </div>
          </div>
        </div>

        <HeroIllustration />
      </div>
    </section>
  );
}
