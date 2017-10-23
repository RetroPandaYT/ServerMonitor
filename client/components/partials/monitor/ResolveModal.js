import React from 'react';

class ResolveModal extends React.Component {

  render() {

    let backdropClass = 'modal-backdrop fade out'
    let dialogClass = 'fade out modal'

    if(this.props.show){
      backdropClass = 'modal-backdrop fade in'
      dialogClass = 'fade in modal'
    }

    return (
      <div className={backdropClass}>

          <div tabIndex="-1" className={dialogClass}>

            <div className="modal-dialog">

              <div className="modal-content" role="document">

                <div className="modal-header">

                  <button type="button" className="close" onClick={this.props.onClose}>
                    <span aria-hidden="true">×</span>
                    <span className="sr-only">Close</span>
                  </button>
                  <h4 className="modal-title">{this.props.modalHeading}</h4>

                </div>

                <div className="modal-body">

                  {this.props.children}

                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-default" data-id={this.props.id} data-resolved={this.props.resolved} onClick={this.props.onAction}>{this.props.actionLabel}</button>
                </div>

              </div>

            </div>

          </div>

      </div>

    );
  }
}


export default ResolveModal;
