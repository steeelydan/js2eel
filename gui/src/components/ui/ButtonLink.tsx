import type { VNode } from 'preact';
import type CSS from 'csstype';
import { COLORS } from '../../constants';
import { useState } from 'preact/hooks';
import type { Icon } from 'react-feather';

type Props = {
    href: string;
    title: string;
    icon?: Icon;
    style?: CSS.Properties;
    download?: string;
};

export const ButtonLink = ({ href, title, icon, style, download }: Props): VNode => {
    const [isHovered, setIsHovered] = useState(false);

    const isHoveredStyles = isHovered
        ? {
              background: COLORS.iconButtonBgHover,
              borderRadius: 3
          }
        : {};

    return (
        <a
            title={title}
            href={href}
            className="linkButton"
            style={
                icon
                    ? {
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: 24,
                          color: 'inherit',
                          background: 'transparent',
                          border: 'none',
                          padding: '3px 5px',
                          font: 'inherit',
                          cursor: 'pointer',
                          outline: 'inherit',
                          ...isHoveredStyles,
                          ...style
                      }
                    : {
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: 24,
                          background: COLORS.buttonBg,
                          color: 'inherit',
                          padding: '3px 5px',
                          font: 'inherit',
                          cursor: 'pointer',
                          outline: 'inherit',
                          ...isHoveredStyles,
                          ...style
                      }
            }
            onMouseEnter={(): void => setIsHovered(true)}
            onMouseLeave={(): void => setIsHovered(false)}
            download={download}
        >
            {icon || title}
        </a>
    );
};
