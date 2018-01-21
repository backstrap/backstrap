require(
    ['./CustomView'],
    function (CustomView) {
        describe('views.CustomView', function () {
            it('includes the HasModel mixin', function () {
                var subject = new CustomView();
                expect(subject.observeModel).toExist();
            });
            it('calls subclass initDOM once on first render', function () {
                class Test extends CustomView {
                    initDOM() {
                        this.called = (this.called||0) + 1;
                    }
                }
                var subject = new Test();

                expect(subject.called).toBeUndefined();
                subject.render();
                expect(subject.called).toBe(1);
                subject.render();
                expect(subject.called).toBe(1);
            });
        });
    }
);
