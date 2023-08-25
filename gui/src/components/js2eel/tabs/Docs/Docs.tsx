import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { Button } from '../../../ui/Button';
import type { VNode } from 'preact';
import { COLORS, HELP_PAGE_TITLES } from '../../../../constants';
import { loadClientSetting, saveClientSetting } from '../../../../storage/clientSettings';
import fileMap from '../../../../docs/rendered-docs.json';
import { useRecallScrollPosition } from '../../useRecallScrollPosition';

export const Docs = (): VNode | null => {
    const [helpPath, setHelpPath] = useState<keyof typeof HELP_PAGE_TITLES>();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [scrollId, setScrollId] = useState<string>();

    // FIXME change to use PersistedScrollable
    useRecallScrollPosition(scrollContainerRef, scrollId);

    useEffect(() => {
        const getLastHelpPath = async (): Promise<void> => {
            const potentialSavedHelpPath = await loadClientSetting('currentHelpPath');

            setHelpPath(
                potentialSavedHelpPath && potentialSavedHelpPath in HELP_PAGE_TITLES
                    ? (potentialSavedHelpPath as keyof typeof HELP_PAGE_TITLES)
                    : 'contents/getting-started'
            );

            setScrollId('docs-' + potentialSavedHelpPath);
        };

        getLastHelpPath();
    }, []);

    const helpParts: string[] = useMemo(() => {
        return helpPath ? helpPath.split('/') : [];
    }, [helpPath]);

    const ourFileName = useMemo(() => helpParts[helpParts.length - 1], [helpParts]);

    type TocProps = {
        docPaths: (keyof typeof HELP_PAGE_TITLES)[];
    };

    const TableOfContents = ({ docPaths }: TocProps): VNode => {
        return (
            <>
                {docPaths.map((docPath, index) => (
                    <Button
                        key={docPath}
                        variant="link"
                        onClick={(): void => {
                            setHelpPath(docPath);
                            saveClientSetting('currentHelpPath', docPath);
                        }}
                        label={HELP_PAGE_TITLES[docPath]}
                        additionalStyles={{
                            marginBottom: index < docPaths.length - 1 ? '8px' : undefined
                        }}
                    />
                ))}
            </>
        );
    };

    return helpPath ? (
        <div
            ref={scrollContainerRef}
            style={{ padding: '12px 16px 32px 16px', overflow: 'auto', scrollBehavior: 'smooth' }}
        >
            <div
                style={{
                    paddingBottom: 4,
                    borderBottom: `1px solid ${COLORS.border}`,
                    height: '24px',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}
            >
                {helpPath !== 'contents' ? (
                    <Button
                        variant="link"
                        onClick={(): void => {
                            setHelpPath((prevHelpPath): keyof typeof HELP_PAGE_TITLES => {
                                if (prevHelpPath && prevHelpPath.includes('/')) {
                                    const newHelpPath = prevHelpPath
                                        .split('/')
                                        .slice(0, -1)
                                        .join('/');

                                    if (newHelpPath in HELP_PAGE_TITLES) {
                                        saveClientSetting('currentHelpPath', newHelpPath);

                                        return newHelpPath as keyof typeof HELP_PAGE_TITLES;
                                    }
                                }

                                return prevHelpPath || 'contents';
                            });
                        }}
                        label="Back"
                    />
                ) : (
                    <div />
                )}
                {helpPath !== 'contents' ? (
                    <div style={{ display: 'flex' }}>
                        {helpParts.length &&
                            helpParts.map((pathPart, index) => (
                                <div
                                    style={{ display: 'flex', alignItems: 'center' }}
                                    key={pathPart}
                                >
                                    {index === helpParts.length - 1 ? (
                                        <div>
                                            {
                                                HELP_PAGE_TITLES[
                                                    helpParts.join(
                                                        '/'
                                                    ) as keyof typeof HELP_PAGE_TITLES
                                                ]
                                            }
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={(): void => {
                                                const thatPart = helpParts
                                                    .slice(0, index - 1)
                                                    .join('/') as keyof typeof HELP_PAGE_TITLES;

                                                setHelpPath(thatPart);
                                                saveClientSetting('currentHelpPath', thatPart);
                                            }}
                                            variant="link"
                                            label={
                                                HELP_PAGE_TITLES[
                                                    pathPart as keyof typeof HELP_PAGE_TITLES
                                                ]
                                            }
                                        />
                                    )}
                                    {helpParts.length > 1 && index < 1 && <>&nbsp;/&nbsp;</>}
                                </div>
                            ))}
                    </div>
                ) : (
                    <div />
                )}
            </div>

            <div style={{ maxWidth: 550, margin: 'auto' }}>
                {helpPath === 'contents' && (
                    <>
                        <h1>Contents</h1>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start'
                            }}
                        >
                            <TableOfContents
                                docPaths={[
                                    'contents/getting-started',
                                    'contents/shortcuts',
                                    'contents/api-documentation',
                                    'contents/limitations',
                                    'contents/feature-comparison',
                                    'contents/development',
                                    'contents/changelog',
                                    'contents/roadmap',
                                    'contents/useful-resources'
                                ]}
                            />
                        </div>
                    </>
                )}
                {fileMap[ourFileName as keyof typeof fileMap] && (
                    <div
                        className="docs"
                        dangerouslySetInnerHTML={{
                            __html: fileMap[ourFileName as keyof typeof fileMap]
                        }}
                    ></div>
                )}
            </div>
        </div>
    ) : null;
};
