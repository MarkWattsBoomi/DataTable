import React = require('react');
import DataTable from './DataTable';

export default class DataTableHeader extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.saveChanges = this.saveChanges.bind(this);
        this.revertChanges = this.revertChanges.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.previousPage = this.previousPage.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        this.forceUpdate();
    }

    saveChanges() {
        const parent: DataTable = this.props.parent;
        parent.saveChanges();
    }

    revertChanges() {
        const parent: DataTable = this.props.parent;
        parent.revertChanges();
    }

    submit() {
        const parent: DataTable = this.props.parent;
        parent.submitData();
    }

    previousPage() {
        const parent: DataTable = this.props.parent;
        parent.previousPage();
    }

    nextPage() {
        const parent: DataTable = this.props.parent;
        parent.nextPage();
    }

    render() {

        const buttons: any[] = [];
        const navButtons: any[] = [];

        const parent: DataTable = this.props.parent;

        // is pagination needed ?
        if (parent.fileEntries.pages > 1) {
            let prevClass: string = 'glyphicon glyphicon-chevron-left data-table-header-buttons-button';
            let prevClick: any = this.previousPage;
            let nextClass: string = 'glyphicon glyphicon-chevron-right data-table-header-buttons-button';
            let nextClick: any = this.nextPage;
            if (parent.resultPageNumber < 2) {
                prevClass += ' data-table-header-buttons-button-dissabled';
                prevClick = undefined;
            }
            if (parent.resultPageNumber >= parent.fileEntries.pages) {
                nextClass += ' data-table-header-buttons-button-dissabled';
                nextClick = undefined;
            }
            navButtons.push(
                <span
                    className={prevClass}
                    title="Previous Page"
                    onClick={prevClick}
                />,
            );

            navButtons.push(
                <span
                    className="data-table-header-buttons-label"
                >
                    {parent.resultPageNumber + ' / ' + parent.fileEntries.pages}
                </span>,
            );

            navButtons.push(
                <span
                    className={nextClass}
                    title="Previous Page"
                    onClick={nextClick}
                />,
            );
        }

        if (parent.viewOnly === false) {
            if (parent.fileEntries.hasChanges === true) {
                buttons.push(
                    <span
                        className="glyphicon glyphicon-floppy-disk data-table-header-buttons-button"
                        title="Save Changes"
                        onClick={this.saveChanges}
                    />,
                );
                buttons.push(
                    <span
                        className="glyphicon glyphicon-erase data-table-header-buttons-button"
                        title="Revert Changes"
                        onClick={this.revertChanges}
                    />,
                );
            } else {
                buttons.push(
                    <span
                        className="glyphicon glyphicon-envelope data-table-header-buttons-button"
                        title="Submit File"
                        onClick={this.submit}
                    />,
                );
            }
        }

        return (
            <div
                className="data-table-header"
            >
                <div
                    className="data-table-header-title"
                >
                    <span
                        className="data-table-header-title-label"
                    >
                        Title
                    </span>
                </div>
                <div
                    className="data-table-header-navbuttons-wrapper"
                >
                    <div
                        className="data-table-header-navbuttons"
                    >
                        {navButtons}
                    </div>
                </div>
                <div
                    className="data-table-header-buttons"
                >
                    {buttons}
                </div>
            </div>
        );
    }
}
