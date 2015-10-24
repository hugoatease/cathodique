var Drawings = React.createClass({
  getInitialState: function() {
    return {
      drawings: []
    }
  },

  fetchDrawings: function() {
    $.get('/api/drawing', function(drawings) {
      drawings.reverse();
      this.setState({drawings: drawings});
    }.bind(this));
  },

  componentDidMount: function() {
    this.fetchDrawings();
    window.setInterval(this.fetchDrawings, 5000);
  },

  render: function() {
    return (
      <div className="row">
        {this.state.drawings.map(function(drawing) {
          var image = '/image/' + drawing.blobId;
          var screened = <span className="label label-warning">Not screened</span>;
          var date = moment(drawing.sent);
          if (drawing.screened) {
            screened = <span className="label label-success">Screened</span>;
          }
          return (
            <div className="col-sm-2">
              <a target="_blank" href={image}><img src={image} className="img-rounded" /></a>
              <br />
              <small>On {drawing.device} by {drawing.author}</small>
              <br />
              <small>{date.format('D MMM HH:mm')}</small>
              <br />
              {screened}
              &nbsp;&nbsp;
              <button className="btn btn-danger btn-xs">Delete</button>
              <br /><br />
            </div>
          );
        })}
      </div>
    );
  }
});

window.Drawings = Drawings;
