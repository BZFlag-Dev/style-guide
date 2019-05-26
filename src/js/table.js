'use strict';

(function() {
    const SORT_EVENT = 'bzflag:sort';

    /**
     * @constructor
     * @param {HTMLTableElement} element
     */
    function SortableTable(element) {
        this._element = element;
        this._ascending = true;
        this._columnNum = null;
        this._sortRules = [];

        const header = this._element.tHead;

        if (header === null) {
            console.warn('A table needs to have a <thead> in order to be sortable.');
            return;
        }

        if (header.rows.length !== 1) {
            console.warn('A sortable table must only have one row in its header.');
            return;
        }

        const colHeadings = header.rows[0].cells;

        for (let i = 0; i < colHeadings.length; i++) {
            const colHeader = colHeadings[i];

            // This column can't be sorted by
            if (colHeader.getAttribute('data-sort-disable') === 'true') {
                continue;
            }

            this._sortRules[i] = {
                castToNumber: colHeader.getAttribute('data-sort-cast') === 'number',
                caseInsensitive: colHeader.getAttribute('data-sort-case-insensitive') === 'true',
            };

            colHeader.addEventListener('click', () => {
                this._ascending = !this._ascending;
                this._columnNum = i;

                const event = new CustomEvent(SORT_EVENT, {
                    columnNum: i,
                    columnName: colHeader.textContent,
                    ascending: !this._ascending,
                });

                this._element.dispatchEvent(event);
                this._updateHeaders();
                this._sortTable();
            });
        }
    }

    SortableTable.prototype._updateHeaders = function() {
        const colHeaders = this._element.tHead.rows[0];
        const headers = colHeaders.querySelectorAll('[data-sort]');

        if (headers) {
            for (let i = 0; i < headers.length; i++) {
                headers[i].removeAttribute('data-sort');
            }
        }

        colHeaders.cells[this._columnNum].setAttribute('data-sort', this._ascending ? 'ASC' : 'DESC');
    };

    SortableTable.prototype._sortTable = function() {
        const body = this._element.tBodies;

        if (!body.length) {
            console.warn('A sortable table must have at least one body.');
            return;
        }

        for (let i = 0; i < body.length; i++) {
            const tableBody = body[i];
            const rowElements = tableBody.rows;
            const sortableRows = [];

            for (let j = 0; j < rowElements.length; j++) {
                const row = rowElements[j];
                const sortCell = row.cells[this._columnNum];

                let value = sortCell.getAttribute('data-sort-value') || sortCell.textContent.trim();

                if (this._sortRules[this._columnNum].castToNumber) {
                    value = +value;
                }

                if (this._sortRules[this._columnNum].caseInsensitive) {
                    value = value.toLocaleLowerCase();
                }

                sortableRows.push({
                    sorting: value,
                    element: row,
                });
            }

            sortableRows.sort((a, b) => {
                if (a.sorting < b.sorting) {
                    return this._ascending ? -1 : 1;
                }
                if (a.sorting > b.sorting) {
                    return this._ascending ? 1 : -1;
                }

                return 0;
            });

            this._element.tBodies[i].innerHTML = '';

            for (let j = 0; j < sortableRows.length; j++) {
                const sortableRow = sortableRows[j];

                this._element.tBodies[i].append(sortableRow.element);
            }
        }
    };

    /** @type {NodeListOf<HTMLTableElement>} */
    const sortableTables = document.querySelectorAll('table[data-sortable="true"]');

    for (let i = 0; i < sortableTables.length; i++) {
        new SortableTable(sortableTables[i]);
    }
})();
