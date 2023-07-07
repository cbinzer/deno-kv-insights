import { FunctionComponent } from 'preact';

const EntryDetailLoadingPlaceholder: FunctionComponent = () => {
  return (
    <div class='entry-detail'>
      <div class='header placeholder-wave'>
        <p class='h5'>
          <span class='placeholder col-2 bg-secondary' style={{ marginRight: '10px' }} />
          <span class='placeholder col-5 bg-secondary' />
        </p>

        <span class='placeholder bg-secondary mb-1' style={{ width: '25px', height: '20px' }} />
      </div>

      <form class='form placeholder-wave'>
        <p>
          <span class='placeholder col-4 bg-secondary' />
          <span class='placeholder col-10 bg-secondary' />
        </p>
        <p>
          <span class='placeholder col-4 bg-secondary' />
          <span class='placeholder col-10 bg-secondary' />
        </p>
        <p>
          <span class='placeholder col-4 bg-secondary' />
          <span class='placeholder col-10 bg-secondary' />
        </p>

        <div>
          <button
            type='submit'
            class='btn btn-primary btn-save disabled float-end placeholder col-1'
            disabled={true}
          />
        </div>
      </form>
    </div>
  );
};

export default EntryDetailLoadingPlaceholder;
