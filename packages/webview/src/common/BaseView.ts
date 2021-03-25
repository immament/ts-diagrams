export default interface BaseView<M> {
  onViewModelChanged(viewModel: M): void;
}
