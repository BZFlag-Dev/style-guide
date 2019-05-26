'use strict';

import { indexLoop, keyboard } from './common';

(function() {
    const TAB_SHOW = 'bzflag:tab-show';

    /**
     * @constructor
     * @param {HTMLDivElement} element
     */
    function TabList(element) {
        this._element = element;
        this._tabNodes = this._element.querySelectorAll('[data-role="tab"]');

        this._initTabs();

        this._tabHeaders = this._element.querySelectorAll('button[role="tab"]');
    }

    TabList.prototype._initTabs = function() {
        const tabHeaders = document.createElement('div');
        tabHeaders.classList.add('tabs__header');
        tabHeaders.setAttribute('role', 'tablist');
        tabHeaders.setAttribute('aria-label', this._element.getAttribute('data-tab-desc'));

        for (let i = 0; i < this._tabNodes .length; i++) {
            const isVisible = i === 0;
            const tabNode = this._tabNodes [i];

            if (!isVisible) {
                tabNode.setAttribute('hidden', '');
            }

            tabNode.setAttribute('role', 'tabpanel');
            tabNode.setAttribute('tabindex', '0');
            tabNode.setAttribute('aria-labelledby', tabNode.getAttribute('id') + '-tabheader');

            const tabHeader = this._createTab(
                tabNode.getAttribute('id'),
                tabNode.getAttribute('data-tab-heading'),
                isVisible,
                i
            );

            tabHeaders.append(tabHeader);
        }

        this._element.prepend(tabHeaders);
    };

    TabList.prototype._displayTab = function(index) {
        for (let i = 0; i < this._tabNodes.length; i++) {
            const tabNode = this._tabNodes[i];

            tabNode.setAttribute('hidden', '');

            if (i === index) {
                tabNode.removeAttribute('hidden');
            }
        }

        for (let i = 0; i < this._tabHeaders.length; i++) {
            const tabHeader = this._tabHeaders[i];

            tabHeader.setAttribute('tabindex', i === index ? '0' : '-1');
            tabHeader.setAttribute('aria-selected', i === index ? 'true' : 'false');
        }
    };

    TabList.prototype._createTab = function(id, title, selected, index) {
        const tab = document.createElement('button');

        tab.innerText = title;

        tab.setAttribute('tabindex', selected ? '0' : '-1');
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', selected ? 'true' : 'false');
        tab.setAttribute('aria-controls', id);
        tab.setAttribute('id', id + '-tabheader');

        tab.addEventListener('click', function (e) {
            e.preventDefault();

            const event = new CustomEvent(TAB_SHOW, {
                tabIndex: index,
                targetTab: id,
                targetTabHeader: id + '-tabheader',
            });

            this._element.dispatchEvent(event);

            this._displayTab(index);
        }.bind(this));

        tab.addEventListener('keydown', function (e) {
            const keyCode = e.keyCode;
            const direction = [
                keyboard.RIGHT,
                keyboard.LEFT,
                keyboard.HOME,
                keyboard.END,
            ];
            const actions = [
                keyboard.SPACE,
                keyboard.ENTER,
            ];

            let dir, act;

            if ((dir = (direction.indexOf(keyCode) >= 0)) || (act = (actions.indexOf(keyCode) >= 0))) {
                e.preventDefault();

                if (dir) {
                    let realIndex = 0;

                    if (keyCode === keyboard.RIGHT) {
                        realIndex = index + 1;
                    } else if (keyCode === keyboard.LEFT) {
                        realIndex = index - 1;
                    } else if (keyCode === keyboard.HOME) {
                        realIndex = 0;
                    } else if (keyCode === keyboard.END) {
                        realIndex = -1;
                    }

                    this._tabHeaders.item(indexLoop(this._tabHeaders, realIndex)).focus();
                }

                if (act) {
                    if (actions.indexOf(keyCode) >= 0) {
                        this._tabHeaders.item(index).click();
                    }
                }
            }

        }.bind(this));

        return tab;
    };

    /** @type {NodeListOf<HTMLDivElement>} */
    const tablists = document.querySelectorAll('[data-role="tablist"]');

    for (let i = 0; i < tablists.length; i++) {
        new TabList(tablists[i]);
    }
})();
