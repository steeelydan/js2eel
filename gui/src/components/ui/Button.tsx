import { useMemo, useState } from 'preact/hooks';
import { COLORS } from '../../constants';

import type { VNode } from 'preact';
import type * as CSS from 'csstype';

type Props = {
    label?: string;
    onClick: (event: MouseEvent) => void;
    title?: string;
    icon?: VNode;
    additionalStyles?: CSS.Properties;
    additionalHoverStyles?: CSS.Properties;
    disabled?: boolean;
    variant?: 'button' | 'buttonSecondary' | 'link';
    form?: string;
    type?: 'submit';
};

export const Button = ({
    icon,
    label,
    onClick,
    title,
    additionalStyles,
    additionalHoverStyles,
    disabled = false,
    variant = 'button',
    form,
    type
}: Props): VNode => {
    const [isHovered, setIsHovered] = useState(false);

    const disabledStyles: CSS.Properties = useMemo(
        () =>
            disabled
                ? variant === 'button' || variant === 'buttonSecondary'
                    ? icon
                        ? { cursor: 'default' }
                        : {
                              backgroundColor: COLORS.buttonBgDisabled,
                              cursor: 'default'
                          }
                    : {
                          color: 'gray',
                          cursor: 'default'
                      }
                : {},
        [disabled, icon, variant]
    );

    const isHoveredStyles: CSS.Properties = useMemo(() => {
        return !disabled && isHovered
            ? variant === 'button' || variant === 'buttonSecondary'
                ? icon
                    ? {
                          backgroundColor:
                              variant === 'buttonSecondary'
                                  ? COLORS.iconButtonBgSecondaryHover
                                  : COLORS.iconButtonBgHover,
                          borderRadius: '3px',
                          ...additionalHoverStyles
                      }
                    : {
                          backgroundColor:
                              variant === 'buttonSecondary'
                                  ? COLORS.buttonBgHoverSecondary
                                  : COLORS.buttonBgHover,
                          borderRadius: '3px',
                          ...additionalHoverStyles
                      }
                : {
                      color: COLORS.linkHover,
                      ...additionalHoverStyles
                  }
            : {};
    }, [additionalHoverStyles, disabled, icon, isHovered, variant]);

    const buttonStyles: CSS.Properties = useMemo(() => {
        return variant === 'button' || variant === 'buttonSecondary'
            ? icon
                ? {
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '24px',
                      color: 'inherit',
                      backgroundColor: 'transparent',
                      border: 'none',
                      padding: '3px 5px',
                      font: 'inherit',
                      cursor: 'pointer',
                      outline: 'inherit',
                      ...additionalStyles
                  }
                : {
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '24px',
                      backgroundColor:
                          variant === 'buttonSecondary'
                              ? COLORS.buttonBgSecondary
                              : COLORS.buttonBg,
                      color: COLORS.buttonColor,
                      border: 'none',
                      padding: '3px 5px',
                      font: 'inherit',
                      cursor: 'pointer',
                      outline: 'inherit',
                      borderRadius: '3px',
                      ...additionalStyles
                  }
            : {
                  backgroundColor: 'transparent',
                  color: COLORS.link,
                  textAlign: 'left',
                  border: 'none',
                  padding: 0,
                  display: 'block',
                  font: 'inherit',
                  cursor: 'pointer',
                  outline: 'inherit',
                  ...additionalStyles
              };
    }, [icon, variant, additionalStyles]);

    const styles = useMemo(() => {
        return {
            ...buttonStyles,
            ...isHoveredStyles,
            ...disabledStyles
        };
    }, [buttonStyles, disabledStyles, isHoveredStyles]);

    return (
        <button
            style={styles}
            onClick={disabled ? undefined : onClick}
            form={form}
            type={type}
            title={title ? title : label}
            onMouseEnter={(): void => setIsHovered(true)}
            onMouseLeave={(): void => setIsHovered(false)}
        >
            {icon && icon}
            {label && icon && <>&nbsp;</>}
            {label && <>{label}</>}
        </button>
    );
};
