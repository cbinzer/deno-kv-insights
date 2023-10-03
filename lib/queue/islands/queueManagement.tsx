import { FunctionComponent } from 'preact';

const QueueManagement: FunctionComponent = () => {
  return (
    <div class='queue-management'>
      <div class='panel'>
        <div class='top-panel-container'>
          <div class='action-container'>
            <button class='btn btn-primary float-end'>Subscribe</button>
          </div>
          <div class='messages-container'></div>
        </div>
      </div>

      <div class='panel'>Panel 2</div>
    </div>
  );
};

export default QueueManagement;
