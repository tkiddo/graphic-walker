import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";


function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export interface ITabOption {
    label: string;
    key: string;
    options?: Record<string, any>;
}
interface EditableTabsProps {
    tabs: ITabOption[];
    selectedKey: string;
    onSelected: (selectedKey: string, index: number) => void;
    allowEdit?: boolean;
    onEditLabel?: (label: string, index: number) => void;
}
export default function EditableTabs(props: EditableTabsProps) {
    const { tabs, selectedKey, onSelected, allowEdit, onEditLabel } = props;
    const [editList, setEditList] = useState<boolean[]>([]);
    const { t } = useTranslation();

    const clearEditStatus = useCallback(() => {
        setEditList(new Array(tabs.length).fill(false))
    }, [tabs.length]);
    
    useEffect(() => {
        clearEditStatus();
    }, [clearEditStatus]);

    return (
        <div className="border-b border-gray-200 dark:border-gray-800 overflow-x-auto overflow-y-hidden" onMouseLeave={clearEditStatus}>
            <nav className="-mb-px flex h-8 border-gray-200 dark:border-gray-800" role="tablist" aria-label="Tabs">
                {tabs.map((tab, tabIndex) => (
                    <span
                        role="tab"
                        tabIndex={0}
                        dangerouslySetInnerHTML={{
                            __html: t(tab.label, tab.options)
                        }}
                        onClick={() => {
                            onSelected(tab.key, tabIndex)
                        }}
                        onDoubleClick={() => {
                            setEditList(v => {
                                const nv = [...v];
                                nv[tabIndex] = true;
                                return nv
                            })
                        }}
                        contentEditable={editList[tabIndex]}
                        onInput={(e) => {
                            onEditLabel && onEditLabel(`${e.currentTarget.textContent}`, tabIndex)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                clearEditStatus();
                                e.preventDefault();
                            }
                        }}
                        key={tab.key}
                        className={classNames(
                            tab.key === selectedKey
                                ? "border rounded-t"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:bg-gray-50 dark:hover:text-gray-200 dark:hover:bg-gray-800",
                            "whitespace-nowrap border-gray-200 dark:border-gray-700 py-1 px-2 pr-6 text-sm cursor-pointer dark:text-white"
                        )}
                    />
                ))}
            </nav>
        </div>
    );
}
